import { combineReducers } from 'redux-immutable'
import { fromJS } from 'immutable'
import defaultSkills from '../defaultSkillsTree.json'

const defaultTree = fromJS(defaultSkills.tree)
const defaultTypes = fromJS(defaultSkills.types)
const defaultDisconnected = fromJS(defaultSkills.disconnected)
const defaultSummary = fromJS({})

// Action Types
const CHANGE_SKILL_POINTS = 'skills/CHANGE_SKILL_POINTS'
const SET_SKILL_TREE = 'skills/SET_SKILL_TREE'
const SET_SKILL_TYPES = 'skills/SET_SKILL_TYPES'
const SET_SKILL_DISCONNECTED = 'skills/SET_SKILL_DISCONNECTED'
const SET_SKILL_SUMMARY = 'skills/SET_SKILL_SUMMARY'

// Action Creators
export function addSkillPoints(amount = 1) {
    return { type: CHANGE_SKILL_POINTS, diff: amount }
}

export function resetSkillTree() {
    return (dispatch, getState) => {
        dispatch({ type: SET_SKILL_TREE, tree: defaultTree })
        dispatch({ type: CHANGE_SKILL_POINTS, diff: getState().getIn(['skills', 'spentPoints']) })
        dispatch(summarizeEffects())
    }
}

export function unlockSkill(path) {
    return (dispatch, getState) => {
        const state = getState()
        let disconnected = path[0] === 'd'
        const tree = state.getIn(['skills', disconnected ? 'disconnected' : 'tree'])
        if (disconnected) {
            path = path.slice(1)
        } else {
            path = path.reduce((acc, curr) => {
                acc.push('children')
                acc.push(curr)
                return acc
            }, [])
        }
        path.push('unlocked')
        if (disconnected)
            dispatch({ type: SET_SKILL_DISCONNECTED, disconnected: tree.setIn(path, true) })
        else
            dispatch({ type: SET_SKILL_TREE, tree: tree.setIn(path, true) })
        dispatch({ type: CHANGE_SKILL_POINTS, diff: -1 })

        const types = tree.getIn([...path.slice(0, -1), 'types'], [])
        let summary = state.getIn(['skills', 'summary'])
        types.forEach(type => summary = summary.set(type, summary.get(type, 0) + 1))
        dispatch({ type: SET_SKILL_SUMMARY, summary })
    }
}

export function saveEditor(json) {
    return (dispatch, getState) => {
        json = JSON.parse(json)
        const tree = fromJS(json.tree)
        const types = fromJS(json.types)
        const disconnected = fromJS(json.disconnected)
        if (tree && types && disconnected) {
            dispatch({ type: SET_SKILL_TREE, tree })
            dispatch({ type: SET_SKILL_TYPES, types })
            dispatch({ type: SET_SKILL_DISCONNECTED, disconnected })
            dispatch({ type: CHANGE_SKILL_POINTS, diff: getState().getIn(['skills', 'spentPoints']) })
            dispatch(summarizeEffects())
        }
    }
}

export function summarizeEffects() {
    return (dispatch, getState) => {
        const reducer = (summary, node) => {
            if (node.get('unlocked'))
                node.get('types', []).forEach(archetype => {
                    if (archetype in summary)
                        summary[archetype]++
                    else
                        summary[archetype] = 1
                })
            node.get('children', []).forEach(node => reducer(summary, node))
            return summary
        }
        let summary = reducer({}, getState().getIn(['skills', 'tree']))
        summary = getState().getIn(['skills', 'disconnected']).reduce(reducer, summary)
        dispatch({ type: SET_SKILL_SUMMARY, summary: fromJS(summary) })
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

const disconnectedReducer = (state = defaultDisconnected, action) => {
    if (action.type === SET_SKILL_DISCONNECTED) return action.disconnected
    return state
}

const summaryReducer = (state = defaultSummary, action) => {
    if (action.type === SET_SKILL_SUMMARY) return action.summary
    return state
}

export default combineReducers({
    points: pointsReducer,
    spentPoints: spentPointsReducer,
    tree: treeReducer,
    types: typesReducer,
    disconnected: disconnectedReducer,
    summary: summaryReducer
})
