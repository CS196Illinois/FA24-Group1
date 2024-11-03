import React from 'react';
import { GetMemories } from '../getImages';

const App = () => {
    const mem = GetMemories()
    mem.then((data) => console.log(data[1].Likes))
    mem.then((data) => console.log(data[1]))
};

export default App;