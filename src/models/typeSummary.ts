export class TypeSummary{

    avgNumber: number;
    avgDistance: number;
    avgSpeed: number;
    maxSpeed: number;
    farthest: number;
    longestTime: number;

    constructor(averageNum: number, averageDist: number, averagePace: number, topSpeed: number, farthest: number, longestTime: number){
        this.avgNumber = averageNum;
        this.avgDistance = averageDist;
        this.avgSpeed = averagePace;
        this.maxSpeed = topSpeed;
        this.farthest = farthest;
        this.longestTime = longestTime;
    }
}

export class RunSummary extends TypeSummary {
    vdot: number;

    constructor(averageNum: number, averageDist: number, averagePace: number, topSpeed: number, farthest: number, longestTime: number, vdot: number){
        super(averageNum, averageDist, averagePace, topSpeed, farthest, longestTime)

        this.vdot = vdot;
    }
}