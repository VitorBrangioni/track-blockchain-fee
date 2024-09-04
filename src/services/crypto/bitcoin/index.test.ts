import axios from "axios";
import { calculateFee, fetchFeeRateInSatoshi, parseSatoshiToBTC } from ".";
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
            const expectedFeeRateInSatoshi = BigNumber(expectedData.estimates['30'].sat_per_vbyte);

            expect(mockedAxios.get).toHaveBeenCalledWith('https://bitcoiner.live/api/fees/estimates/latest');
            expect(feeRateInSatoshi).toEqual(expectedFeeRateInSatoshi);
        });

        it('should throw an error if it doesnt return a number', async () => {
            const expectedErrorMessage = 'Error to get satoshi per vbyte';
            const mockData = {
                "timestamp": 1725362927,
                "estimates": {
                    "30": {
                        "sat_per_vbyte": 'IsNotNumber',
                        "total": {
                            "p2wpkh": {
                                "usd": 0.5066172018,
                                "satoshi": 877
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
            const satoshi = BigNumber(846);
            const satoshiInBtc = parseSatoshiToBTC(satoshi);

            const expectedSatoshiInBtc = satoshi.multipliedBy(1e-8);

            expect(satoshiInBtc).toEqual(BigNumber(expectedSatoshiInBtc));
        });
    });

    describe('calculateFee', () => {

        it('should calculate fee correctly', async () => {
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
            const expectedSatPerVbyte = expectedData.estimates['30'].sat_per_vbyte;
            mockedAxios.get.mockResolvedValue({ data: expectedData });

            const transactionSizeDefault = 140;
            const expectedFeeWithoutParams = BigNumber(expectedSatPerVbyte).multipliedBy(transactionSizeDefault);
            const expectedResultWithoutParams: CalculateFeeResult = {
                currency: 'BTC',
                value: parseSatoshiToBTC(expectedFeeWithoutParams)
            };
            const realFeeResultWithoutParam = await calculateFee();

            const transactionSizeWithParam = 33333;
            const expectedFeeWithParam = BigNumber(expectedSatPerVbyte).multipliedBy(transactionSizeWithParam);
            const expectedResultWithParam: CalculateFeeResult = {
                currency: 'BTC',
                value: parseSatoshiToBTC(expectedFeeWithParam)
            };
            const realFeeResultWithParam = await calculateFee(transactionSizeWithParam);

            expect(realFeeResultWithoutParam).toEqual(expectedResultWithoutParams);
            expect(realFeeResultWithParam).toEqual(expectedResultWithParam);
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