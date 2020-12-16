import React, { useEffect } from 'react';
import { Hub } from '@aws-amplify/core';
import { DataStore } from '@aws-amplify/datastore';
import { Todo1 } from './models';

import './App.css';

// window.LOG_LEVEL = 'DEBUG';

function App() {
    useEffect(() => {
        DataStore.start();

        let Todo1Subscription;

        // Create listener
        const listener = Hub.listen('datastore', async (hubData) => {
            const { event, data } = hubData.payload;

            if (event !== 'modelSynced') {
                console.log(event, data);
            }

            if (event === 'storageSubscribed') {
                Todo1Subscription = DataStore.observe(Todo1).subscribe(
                    (msg) => {
                        console.log(
                            'Todo1 subscription:',
                            msg.opType,
                            msg.element
                        );
                    }
                );
            }
        });

        // Remove listener
        return () => {
            listener();

            if (Todo1Subscription) {
                Todo1Subscription.unsubscribe();
            }
        };
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <input
                    type="button"
                    value="Save new Todo1"
                    onClick={async () => {
                        await DataStore.save(
                            new Todo1({
                                name: 'My First Post',
                                description: 'Yes',
                            })
                        );
                    }}
                />

                <input
                    type="button"
                    value="Clear DataStore"
                    onClick={async () => {
                        await DataStore.clear();
                        console.log('Datastore cleared');
                    }}
                />

                <input
                    type="button"
                    value="Stop DataStore"
                    onClick={async () => {
                        await DataStore.stop();
                        console.log('Datastore stopped');
                    }}
                />

                <input
                    type="button"
                    value="Start DataStore"
                    onClick={async () => {
                        await DataStore.start();
                        console.log('Datastore started');
                    }}
                />
            </header>
        </div>
    );
}

export default App;
