import {categories} from '../data/categories'
import {v4 as uuidv4} from 'uuid'
import type { ActivityActions, ActivityState } from '../reducers/activity-reducer'
import type { Activity } from '../types'
import { useState, type ChangeEvent, type FormEvent, type Dispatch, useEffect } from 'react'


// declaracion de props
type FormProps = {
    dispatch: Dispatch<ActivityActions>, 
    state : ActivityState
}

// estado inicial del arreglo
const initialState : Activity = {
        id : uuidv4(),
        category: 1,
        name: '',
        calories: 0
    }

export default function Form({dispatch, state}: FormProps) {

    const [activity, setActivity] = useState<Activity>(initialState)


    // coloca los valores de las actividades en el formulario al dar clic en editar
    useEffect(() => {
        if(state.activeId) {
            const selectedActivity = state.activities.filter( stateActivity => stateActivity.id === state.activeId)[0]
            setActivity(selectedActivity)
        }
    }, [state.activeId])

    const handleChange = (e : ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => { // unifica los dos tipos de evento handleChange
        const isNumberField = ['category', 'calories'].includes(e.target.id) // verifica si el id del target es category o calories
        
        setActivity({
            ...activity, // guarda la copia para no perder la referencia
            [e.target.id] : isNumberField ? +e.target.value : e.target.value // en cierto id, escribe el valor ingresado
        })                                  // es un numero o  es un string
    }

    // validacion del formulario
    const isValidActivity = () => { 
        const {name, calories} = activity
        return name.trim() !== '' && calories > 0
    }

    // envio y reseteo del formulario
    const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        dispatch({type: 'save-activity', payload: {newActivity: activity}})
        setActivity({
            ...initialState, // guardamos la copia del estado inicial
            id : uuidv4() // generamos un nuevo id para cada actividad
        }) 
    }



  return (
    <form 
    className='space-y-5 bg-white shadow p-10 rounded-lg'
    onSubmit= {handleSubmit}>
        

    <p>Formulario</p>

    <div className='grid grid-cols-1 gap-3'>
        <label htmlFor="category" className='font-bold'>Categoria:</label>
        <select 
        className="border border-slate-300 p-2 rounded-lg w-full bg-white" id="category"
        value={activity.category}
        onChange={handleChange /* e */ }>

           {categories.map(category =>(
            <option
             key={category.id} 
             value={category.id}
             >
                {category.name}
            </option>
           ))}   

        </select>
    </div>

    <div className='grid grid-cols-1 gap-3'>
           <label htmlFor="name" className='font-bold'>Actividad:</label>
           <input id='name'
           type='text'
           className='border border-slate-300 p-2 rounded-lg'
           placeholder='Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas, Bicicleta'
           value={activity.name}
           onChange={handleChange}
           />
    </div>

    <div className='grid grid-cols-1 gap-3'>
           <label htmlFor="calories" className='font-bold'>Calorías:</label>
           <input id='calories'
           type='text'
           className='border border-slate-300 p-2 rounded-lg'
           placeholder='Calorías. ej. 300 o 500'
           value={activity.calories}
           onChange={handleChange} 
           />
    </div>

    <input type="submit"
        className='bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10'
        value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}
        disabled={!isValidActivity()}/>

    </form>
  )
}
