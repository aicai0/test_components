import selfLocalStorage from '../assets/js/local_storage.js'

export default {
    save_todo_list(state, data) {
        state.todoList = data
    },
}