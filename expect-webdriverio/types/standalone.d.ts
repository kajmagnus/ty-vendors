/// <reference types="expect-webdriverio/types/expect-webdriverio"/>

declare namespace ExpectWebdriverIO {
    interface Matchers <R,T> extends Readonly<import('expect/build/types').Matchers<R>> {
        not: Matchers <R,T>
        resolves: Matchers<Promise<R>, T>
        rejects: Matchers<Promise<R>, T>
    }
    type Expect = {
        <T = unknown>(actual: T): Matchers<T, T>;
    }
}
