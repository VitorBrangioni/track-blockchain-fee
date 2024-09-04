import { BehaviorSubject } from "rxjs";

type SignalToTerminate = 'SIGTERM' | 'SIGINT';

export const isRunning = new BehaviorSubject(false);

const waitStopProcessToExit = (signalToTerminate: SignalToTerminate) => {
    isRunning.subscribe(value => {
        console.log(`Received ${signalToTerminate}, shutting down gracefully...`);
        if (value === false) {
            console.log('Finished gracefully');
            process.exit(0);
        }
    });
}

export default (() => {
    // docker stop $ID
    process.on('SIGTERM', () => { 
        waitStopProcessToExit('SIGTERM');
    });
    
    // Ctrl+C
    process.on('SIGINT', () => { 
        waitStopProcessToExit('SIGINT');
    });
});