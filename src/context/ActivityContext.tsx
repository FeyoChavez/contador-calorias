import {createContext, useMemo, useReducer, type Dispatch, type ReactNode} from "react"
import { activityReducer, initialState, type ActivityActions, type ActivityState } from "../reducers/activity-reducer"
import { categories } from "../data/categories"
import type { Activity } from "../types"

type ActivityProviderProps = {
    children: ReactNode
}
// este type debe coincidir con lo que retorna el provider (line 32)
type ActivityContextProps = {
    state: ActivityState,
    dispatch: Dispatch<ActivityActions>
    caloriesConsumed : number
    caloriesBurned : number
    netCalories : number,
    categoryName : (category: Activity["category"]) => string[] // : extraido al posicionarse sobre el const
    isEmptyActivities : boolean
}

export const ActivityContext = createContext<ActivityContextProps>(null!)

export const ActivityProvider = ({children} : ActivityProviderProps) => { // este se manda a llamar en el main
    
    // variables globales
    const [state, dispatch] = useReducer(activityReducer, initialState)

    // CalorieTracker
    const caloriesConsumed = useMemo(() => state.activities.reduce((total, activity) => activity.category === 1 ? 
    total + activity.calories : total, 0), [state.activities]) // solo suma las calorias de comida
    
    const caloriesBurned = useMemo(() => state.activities.reduce((total, activity) => activity.category === 2 ? 
    total + activity.calories : total, 0), [state.activities]) // solo suma las calorias de comida
    
    const netCalories = useMemo(() => caloriesConsumed - caloriesBurned, [state.activities])

    // ActivityList
    // cada vez que se agreguen actividades, ejecuta este codigo
    const categoryName = useMemo(() => 
        (category: Activity['category']) => categories.map(cat => cat.id === category ? cat.name : ''), 
    [state.activities])

    const isEmptyActivities = useMemo(() => state.activities.length === 0 , [state.activities])

    return (
        <ActivityContext.Provider value ={{
            state,
            dispatch, 
            caloriesConsumed,
            caloriesBurned,
            netCalories,
            categoryName,
            isEmptyActivities
        }}>

            {children}
        </ActivityContext.Provider>
    )
}