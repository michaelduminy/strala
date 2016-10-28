import {TypeSummary} from './typeSummary'

export class Summary {
    date: Date
    typeSummaries: TypeSummary[];

    constructor(summaries: TypeSummary[]){
        this.typeSummaries = summaries;
        this.date = new Date()
    }
}