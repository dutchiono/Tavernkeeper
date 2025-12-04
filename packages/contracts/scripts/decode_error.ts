import { ethers } from "hardhat";

async function main() {
    const errors = [
        "LiquidityAdd()",
        "LiquiditySub()",
        "LiquidityZero()",
        "Amount0Delta()",
        "Amount1Delta()",
        "InvalidCurrency()",
        "GlobalStateNotInitialized()",
        "ManagerLocked()",
        "InvalidHookResponse()",
        "HookAddressNotValid()",
        "HookDeltaExceedsSwapAmount()",
        "DelegateCallNotAllowed()",
        "InvalidFee()",
        "InvalidTickSpacing()",
        "CurrenciesOutOfOrderOrEqual()",
        "OracleSubscriptionsNotAllowed()",
        "SafeCastOverflow()",
        "SafeCastUnderflow()",
        "MulDivOverflow()",
        "TickSpacingNotSupported()",
        "TickBoundaries()",
        "PoolNotInitialized()",
        "PoolAlreadyInitialized()"
    ];

    console.log("Selector | Error Signature");
    console.log("---------|----------------");
    for (const err of errors) {
        const selector = ethers.id(err).slice(0, 10);
        console.log(`${selector} | ${err}`);
    }
}

main();
