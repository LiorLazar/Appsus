// Editor service for NoteEditor logic
import { noteService } from './note.service.js'
import { utilService } from '../../../services/util.service.js'

const debouncedSave = utilService.debounce((note, onSave) => {
    note.createdAt = Date.now()
    noteService.save(note).then(saved => {
        if (onSave) onSave(saved)
    })
}, 400)

function handleChange(setEditNote, debouncedSave, onSave) {
    return (field, value) => {
        setEditNote(prev => {
            const updated = {
                ...prev,
                info: { ...prev.info, [field]: value }
            }
            debouncedSave(updated, onSave)
            return updated
        })
    }
}

function handleRemoveMedia(setEditNote, editNote, debouncedSave, onSave) {
    return () => {
        setEditNote(prev => ({
            ...prev,
            type: 'NoteTxt',
            info: { ...prev.info, url: undefined }
        }))
        debouncedSave({ ...editNote, type: 'NoteTxt', info: { ...editNote.info, url: undefined } }, onSave)
    }
}

function handleAddTodo(setEditNote, debouncedSave, onSave) {
    return (newTodoTxt) => {
        if (!newTodoTxt.trim()) return
        setEditNote(prev => {
            const newTodos = Array.isArray(prev.info.todos)
                ? [...prev.info.todos, { txt: newTodoTxt, doneAt: null, id: (Date.now() + Math.random()).toString(36) }]
                : [{ txt: newTodoTxt, doneAt: null, id: (Date.now() + Math.random()).toString(36) }]
            const updated = {
                ...prev,
                info: { ...prev.info, todos: newTodos }
            }
            debouncedSave(updated, onSave)
            return updated
        })
    }
}

function handleEditTodo(setEditNote, debouncedSave, onSave) {
    return (idx, value) => {
        setEditNote(prev => {
            const newTodos = prev.info.todos.map((todo, i) =>
                i === idx ? { ...todo, txt: value } : todo
            )
            const updated = {
                ...prev,
                info: { ...prev.info, todos: newTodos }
            }
            debouncedSave(updated, onSave)
            return updated
        })
    }
}

function handleImgBtnClick(fileInputRef, editNote) {
    return (e) => {
        e.preventDefault();
        if (editNote.type === 'NoteTodos' || editNote.type === 'NoteVideo') return;
        if (fileInputRef.current) fileInputRef.current.click();
    }
}

function handleFileChange(setEditNote, debouncedSave, onSave) {
    return (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (ev) {
            const imgDataUrl = ev.target.result;
            setEditNote(prev => {
                const updated = {
                    ...prev,
                    type: 'NoteImg',
                    info: { ...prev.info, url: imgDataUrl }
                };
                debouncedSave(updated, onSave);
                return updated;
            });
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }
}

export const editorService = {
    debouncedSave,
    handleChange,
    handleRemoveMedia,
    handleAddTodo,
    handleEditTodo,
    handleImgBtnClick,
    handleFileChange
}