import { NoteCreateBar } from "../cmps/NoteCreateBar.jsx";
import { NoteList } from "../cmps/NoteList.jsx";

const { Fragment } = React;

export function NoteIndex({ isOpen }) {
    return (
        <Fragment>
            <NoteCreateBar isOpen={isOpen}/>
            <NoteList isOpen={isOpen}/>
        </Fragment>
    );
}