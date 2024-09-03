import axios from "axios";
import { calculateFee, calculateSatPerVbyte, fetchFeeRateInSatoshi, parseSatoshiToBTC } from ".";
import BigNumber from "bignumber.js";
import { CalculateFeeResult } from "../interfaces";
import { logger } from "../../report-fee";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('bitcoin', () => {

    describe('fetchFeeRateInSatoshi', () => {

        it('should send a request a GET and return the total total value in Satoshi', async () => {
            const expectedData = {
                "timestamp": 1725362927,
                "estimates": {
                    "30": {
                        "sat_per_vbyte": 6,
                        "total": {
                            "p2wpkh": {
                                "usd": 0.5066172018,
                                "satoshi": 846
                            },
                            "p2sh-p2wpkh": {
                                "usd": 0.5964429468,
                                "satoshi": 996
                            },
                            "p2pkh": {
                                "usd": 0.8120247348,
                                "satoshi": 1356
                            }
                        }
                    },
                }
            }
            mockedAxios.get.mockResolvedValue({ data: expectedData });

            const feeRateInSatoshi = await fetchFeeRateInSatoshi();

            expect(mockedAxios.get).toHaveBeenCalledWith('https://bitcoiner.live/api/fees/estimates/latest');
            expect(feeRateInSatoshi).toBe(expectedData.estimates['30'].total.p2wpkh.satoshi);
        });

        it('should throw an error if it doesnt return a number', async () => {
            const expectedErrorMessage = 'Error to get p2wpkh value';
            const mockData = {
                "timestamp": 1725362927,
                "estimates": {
                    "30": {
                        "sat_per_vbyte": 6,
                        "total": {
                            "p2wpkh": {
                                "usd": 0.5066172018,
                                "satoshi": 'isNotNumber'
                            },
                            "p2sh-p2wpkh": {
                                "usd": 0.5964429468,
                                "satoshi": 996
                            },
                            "p2pkh": {
                                "usd": 0.8120247348,
                                "satoshi": 1356
                            }
                        }
                    },
                }
            }
            mockedAxios.get.mockResolvedValue({ data: mockData });

            const fetchFeeRateInSatoshiPromise = fetchFeeRateInSatoshi();

            await expect(fetchFeeRateInSatoshiPromise)
                .rejects
                .toThrow(expectedErrorMessage);
        });

        it('should throw an error if the api fails', async () => {
            const expectedMessageError = 'Network Error';
            mockedAxios.get.mockRejectedValueOnce(new Error(expectedMessageError));

            const fetchFeeRateInSatoshiPromise = fetchFeeRateInSatoshi();

            await expect(fetchFeeRateInSatoshiPromise)
                .rejects
                .toThrow(expectedMessageError);
        });
    });

    describe('parseSatoshiToBTC', () => {

        it('should parse satoshi to BTC correctly', () => {
            const satoshi = 846;
            const satoshiInBtc = parseSatoshiToBTC(satoshi);

            const expectedSatoshiInBtc = satoshi * (1e-8);

            expect(satoshiInBtc).toEqual(BigNumber(expectedSatoshiInBtc));
        });
    });

    describe('calculateSatPerVbyte', () => {

        it('should calculate Satoshi per Vbyte correctly', async () => {
            const expectedData = {
                "timestamp": 1725362927,
                "estimates": {
                    "30": {
                        "sat_per_vbyte": 6,
                        "total": {
                            "p2wpkh": {
                                "usd": 0.5066172018,
                                "satoshi": 846
                            },
                            "p2sh-p2wpkh": {
                                "usd": 0.5964429468,
                                "satoshi": 996
                            },
                            "p2pkh": {
                                "usd": 0.8120247348,
                                "satoshi": 1356
                            }
                        }
                    },
                }
            }
            mockedAxios.get.mockResolvedValue({ data: expectedData });

            const transactionSizeDefault = 140;
            const satPerVbyteExpectedWithoutParams = (expectedData.estimates['30'].total.p2wpkh.satoshi / transactionSizeDefault) * transactionSizeDefault;
            const satPerVbyteResWithoutParam = await calculateSatPerVbyte();

            const transactionSize = 333333;
            const satPerVbyteExpectedWithParams = (expectedData.estimates['30'].total.p2wpkh.satoshi / transactionSize) * transactionSize;
            const satPerVbyteResWithParam = await calculateSatPerVbyte(transactionSize);

            expect(satPerVbyteResWithoutParam).toBe(satPerVbyteExpectedWithoutParams);
            expect(satPerVbyteExpectedWithParams).toBe(satPerVbyteResWithParam);
        });
    });

    describe('calculateFee', () => {

        it('should calculate the estimated fee correctly', async () => {
            const mockData = {
                "timestamp": 1725362927,
                "estimates": {
                    "30": {
                        "sat_per_vbyte": 6,
                        "total": {
                            "p2wpkh": {
                                "usd": 0.5066172018,
                                "satoshi": 846
                            },
                            "p2sh-p2wpkh": {
                                "usd": 0.5964429468,
                                "satoshi": 996
                            },
                            "p2pkh": {
                                "usd": 0.8120247348,
                                "satoshi": 1356
                            }
                        }
                    },
                }
            }
            mockedAxios.get.mockResolvedValue({ data: mockData });

            const expectedValueInSatoshi = mockData.estimates[30].total.p2wpkh.satoshi;// TODO
            const expectedData: CalculateFeeResult = {
                currency: 'BTC',
                value: parseSatoshiToBTC(expectedValueInSatoshi)
            };

            const estimatedFee = await calculateFee();

            expect(estimatedFee).toEqual(expectedData);
        });

        it('should log an error if there`s any failure.', async () => {
            const expectedMessageError = 'Any Error';
            mockedAxios.get.mockRejectedValueOnce(new Error(expectedMessageError));

            const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation(() => logger);

            await calculateFee();

            expect(loggerErrorSpy).toHaveBeenCalledWith(`Error to calculate fee: ${expectedMessageError}`);
        });
    });
});