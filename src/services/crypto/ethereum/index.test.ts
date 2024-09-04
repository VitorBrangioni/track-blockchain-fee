import axios from "axios";
import { calculateFee, fetchGasPrice } from ".";
import { convertWeiToBnbOrEther } from "../utils";
import { CalculateFeeResult } from "../interfaces";
import BigNumber from "bignumber.js";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ethereum', () => {

    describe('fetchGasPrice', () => {

        it('should send a request POST to call "eth_gasPrice" and return the result in BigNumber', async () => {
            const resultInHex = "0x8ffb8d42";
            const expectedData = {
                "jsonrpc": "2.0",
                "id": 1,
                "result": "0x8ffb8d42"
            }
            mockedAxios.post.mockResolvedValue({ data: expectedData });

            const gasPrice = await fetchGasPrice();

            expect(mockedAxios.post).toHaveBeenCalledWith('https://ethereum.publicnode.com/', { "method": "eth_gasPrice", "params": [], "id": 1, "jsonrpc": "2.0" });
            expect(gasPrice).toEqual(BigNumber(resultInHex));
        });

        it('should throw an error if it doesnt return a number', async () => {
            const expectedMessageError = 'Error to fetch the gas price';
            const expectedData = {
                "jsonrpc": "2.0",
                "id": 1,
                "result": 'isNotNumber'
            };
            mockedAxios.post.mockResolvedValue({ data: expectedData });

            const gasPrice = fetchGasPrice();

            await expect(gasPrice)
                .rejects
                .toThrow(expectedMessageError);
        });

        it('should throw an error if the api fails', async () => {
            const expectedMessageError = 'Network Error';
            mockedAxios.post.mockRejectedValueOnce(new Error(expectedMessageError));

            const fetchGasPricePromise = fetchGasPrice();

            await expect(fetchGasPricePromise)
                .rejects
                .toThrow(expectedMessageError);
        });
    });


    describe('calculateFee', () => {

        it('should calculate correctly the estimated fee', async () => {
            const resultInHex = "0x3b9aca00";
            const mockData = {
                "jsonrpc": "2.0",
                "id": 1,
                "result": resultInHex
            };
            mockedAxios.post.mockResolvedValue({ data: mockData });

            const mockGasPrice = BigNumber(resultInHex);
            const mockTipInWei = BigNumber(2);
            const mockGasLimit = 2000;

            const expectedFee = mockGasPrice.plus(mockTipInWei).multipliedBy(mockGasLimit);
            const expectedResult: CalculateFeeResult = {
                currency: 'ETH',
                value: convertWeiToBnbOrEther(expectedFee)
            };
            const realResult = await calculateFee(mockGasLimit, mockTipInWei);

            expect(expectedResult).toEqual(realResult);
        });
    });

});