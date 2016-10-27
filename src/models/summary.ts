import {TypeSummary} from './typeSummary'

export class Summary {
    private typeSummaries: TypeSummary[];

    constructor(summaries: TypeSummary[]){
        this.typeSummaries = summaries;
    }
}