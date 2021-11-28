class StopWatch{
    constructor() {
        this.start = null;
        this.stop = null;
    }

    startTimer(){
        if(this.stop) {
            this.start = this.stop;
            this.stop = null;
            return;
        }
        this.start = Date.now();
    }

    stopTimer(){
        if(this.stop)
            return;
        this.stop = Date.now();
    }

    reset(){
        this.start = null;
        this.stop = null;
    }

    get getTimeElapsedInMs(){
        if(this.start == null)
            return 0;

        if(this.stop == null)
            return Date.now() - this.start;

        return this.stop - this.start;
    }

    get getSecondsElapsedIn60Seconds(){
        return Math.floor(this.getTimeElapsedInMs / 1000 % 60);
    }

    get getTimeElapsedInMinutes(){
        return Math.floor(this.getTimeElapsedInMs / 1000 / 60);
    }

    get getCurrentMillaSecondElapsedAsFraction(){
        return this.getTimeElapsedInMs % 1000 / 1000;
    }

    get getTimeElapsedInStopWatchFormatString(){
        // console.log("mins");
        // console.log(this.getTimeElapsedInMinutes);
        let minsNumberAsString = String(this.getTimeElapsedInMinutes);
        let minsAs2Digits = minsNumberAsString.length > 1 ? minsNumberAsString : "0" + minsNumberAsString;

        let secondsNumberAsString = String(this.getSecondsElapsedIn60Seconds);
        let secondsAs2Digits = secondsNumberAsString.length > 1 ? secondsNumberAsString : "0" + secondsNumberAsString;

        let millaSecondAs2DigitNumberAsString = "0" + String(Math.round(this.getCurrentMillaSecondElapsedAsFraction * 10));

        return `${minsAs2Digits}:${secondsAs2Digits}:${millaSecondAs2DigitNumberAsString}`;
    }
}

var StopWatch_1 = StopWatch;

var StopWatch_1$1 = StopWatch_1;

var dist = {
	StopWatch: StopWatch_1$1
};

export default dist;
