
export function convertWeiToBnbOrEther(wei: number) {
    const weiInBnbOrEther = 1e-18;
    
    return wei * weiInBnbOrEther;
}