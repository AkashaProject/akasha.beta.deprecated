// @flow strict

import * as React from 'react';
import { Route } from 'react-router-dom';

/*:: type Props = {||}; */

function EditorPage (props /* : Props */) {
    return (
        <>
            <Route path="/draft/article/:draftId" render={ () => <>Create New Article</> }/>
            <Route path="/draft/link/:draftId" render={ () => <>Create New Link</> }/>
        </>
    );
}

export default EditorPage;
