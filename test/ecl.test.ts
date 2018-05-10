suite("ECL Extension Tests", () => {
    suiteSetup(() => {
    });

    suiteTeardown(() => {
    });

    test("Async Test", (done) => {
        new Promise((resolve, reject) => {
            resolve();
        }).then(() => done(), done);
    });
});
