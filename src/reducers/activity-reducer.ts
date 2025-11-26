import type { Activity } from '../types/index';

export type ActivityActions = 
{ type: 'save-activity', payload: {newActivity: Activity } } |  // payload son los datos que le pasas
{ type: 'set-activeId', payload: {id: Activity['id'] } } |
{ type: 'delete-activity', payload: {id: Activity['id'] } } |
{ type: 'restart-app' }

// declaracion de types
export type ActivityState = { 
    activities : Activity[],
    activeId: Activity['id'] // :string
}

const localStorageActivities = () : Activity[] => {
    const activities = localStorage.getItem('activities')
    return activities ? JSON.parse(activities) : []
}

export const initialState : ActivityState = {
    activities : localStorageActivities(),
    activeId : ''
}

export const activityReducer = (
        state: ActivityState = initialState,
        action: ActivityActions
    ) => {

    // Guardar los registros
     if(action.type === 'save-activity') {

        let updatedActivities : Activity[] = []

        if(state.activeId) {
            updatedActivities = state.activities.map( activity => activity.id === state.activeId ? 
                action.payload.newActivity : activity)

        } else {
            updatedActivities = [...state.activities, action.payload.newActivity]
        }
        // Codigo que maneja la logica para actualizar el state
        return {
            ...state,
            activities: updatedActivities,
            activeId: ''
        }
     }

     // Editar registro
     if(action.type === 'set-activeId') {
        return {
            ...state, // guardamos una copia
            activeId: action.payload.id  // mandamos la copia a payload 
        }
     }


     // Eliminar registro
     if(action.type === 'delete-activity') {
        return {
            ...state,
            activities: state.activities.filter(activity => activity.id !== action.payload.id)
        }
     }

     // Reiniciar la aplicacion
     if(action.type === 'restart-app'){
        return {
            activities: [],
            activeId: ''
        }
     }

     return state
}