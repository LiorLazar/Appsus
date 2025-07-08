import { NoteCreateBar } from "../cmps/NoteCreateBar.jsx";
import { NoteList } from "../cmps/NoteList.jsx";


const { useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

const { Fragment } = React;

export function NoteIndex() {

    return (
        <Fragment>
            <NoteCreateBar />
            <NoteList />
        </Fragment>
    );
}