import { pickle } from 'cucumber';
import RunnableStats from './runnable';
export interface Test {
    type: 'test:start' | 'test:pass' | 'test:fail' | 'test:retry' | 'test:pending' | 'test:end';
    title: string;
    parent: string;
    fullTitle: string;
    pending: boolean;
    file?: string;
    duration?: number;
    cid: string;
    specs: string[];
    uid: string;
    pendingReason?: string;
    error?: Error;
    errors?: Error[];
    retries?: number;
    argument?: pickle.Argument;
}
interface Output {
    method: 'PUT' | 'POST' | 'GET' | 'DELETE';
    endpoint: string;
    body: {};
    result: {
        value: string | null;
    };
    sessionId: string;
    cid: string;
    type: 'command' | 'result';
}
export default class TestStats extends RunnableStats {
    uid: string;
    cid: string;
    title: string;
    fullTitle: string;
    output: Output[];
    argument?: pickle.Argument;
    retries?: number;
    state: 'pending' | 'passed' | 'skipped' | 'failed';
    pendingReason?: string;
    errors?: Error[];
    error?: Error;
    constructor(test: Test);
    pass(): void;
    skip(reason: string): void;
    fail(errors?: Error[]): void;
}
export {};
//# sourceMappingURL=test.d.ts.map