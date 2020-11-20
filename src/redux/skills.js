import { combineReducers } from 'redux-immutable'
import { fromJS } from 'immutable'
import defaultSkills from '../defaultSkillsTree.json'

const defaultTree = fromJS(defaultSkills.tree)
const defaultTypes = fromJS(defaultSkills.types)

// Action Types
const CHANGE_SKILL_POINTS = 'skills/CHANGE_SKILL_POINTS'
const SET_SKILL_TREE = 'skills/SET_SKILL_TREE'
const SET_SKILL_TYPES = 'skills/SET_SKILL_TYPES'

// Action Creators
export function addSkillPoints(amount = 1) {
    return { type: CHANGE_SKILL_POINTS, diff: amount }
}

export function resetSkillTree() {
    return (dispatch, getState) => {
        dispatch({ type: SET_SKILL_TREE, tree: defaultTree })
        dispatch({ type: CHANGE_SKILL_POINTS, diff: getState().getIn(['skills', 'spentPoints']) })
    }
}

export function unlockSkill(path) {
    return (dispatch, getState) => {
        const tree = getState().getIn(['skills', 'tree'])
        path = path.reduce((acc, curr) => {
            acc.push('children')
            acc.push(curr)
            return acc
        }, [])
        path.push('unlocked')
        dispatch({ type: SET_SKILL_TREE, tree: tree.setIn(path, true) })
        dispatch({ type: CHANGE_SKILL_POINTS, diff: -1 })
    }
}

export function saveEditor(json) {
    return (dispatch, getState) => {
        json = JSON.parse(json)
        const tree = fromJS(json.tree)
        const types = fromJS(json.types)
        if (tree && types) {
            dispatch({ type: SET_SKILL_TREE, tree })
            dispatch({ type: SET_SKILL_TYPES, types })
            dispatch({ type: CHANGE_SKILL_POINTS, diff: getState().getIn(['skills', 'spentPoints']) })
        }
    }
}

// Reducers
const pointsReducer = (state = 100, action) => {
    if (action.type === CHANGE_SKILL_POINTS) return state + action.diff
    return state
}

const spentPointsReducer = (state = 0, action) => {
    if (action.type === CHANGE_SKILL_POINTS) return state - action.diff
    return state
}

const treeReducer = (state = defaultTree, action) => {
    if (action.type === SET_SKILL_TREE) return action.tree
    return state
}

const typesReducer = (state = defaultTypes, action) => {
    if (action.type === SET_SKILL_TYPES) return action.types
    return state
}

export default combineReducers({
    points: pointsReducer,
    spentPoints: spentPointsReducer,
    tree: treeReducer,
    types: typesReducer
})
