import { app, text } from "./hyperapp.mjs"
import {
  main, section,
  h1, h2, h3,
  span, a, p,
  label, form, input, select, option,
  ul, li,
  summary, details,
  code,
} from "./hyperapp-html.mjs"
import { data } from "./data.mjs"
import { units, kindOfUnit, factorOfUnit } from "./units.mjs"

const num_to_scientific = (x) => {
  const arr = Number
  .parseFloat(x.toPrecision(5))
  .toExponential()
  .split("e")
  .map(n => Number.parseFloat(n))
  return {
    mantissa: arr[0],
    exponent: arr[1]
  }
}

// Preprocess data
for (const group_id in data) {
  const group = data[group_id]
  for (const form_id in group.forms) {
    const form = group.forms[form_id]
    for (const variable_id in form.variables) {
      const variable = form.variables[variable_id]
      const scientific = num_to_scientific(variable.value)
      variable.mantissa = scientific.mantissa
      variable.exponent = scientific.exponent
      variable.default_unit = variable.unit
      variable.unit_ratio = 1
      const i = form.order.indexOf(variable_id) / (form.order.length - 1)
      variable.prefix = (
          i == 1 ? '➡️'
        : i == 0 ? '⭐'
        : ''
      )
    }
  }
}

const Calculate = (group_id, form_id, variable_id, self=false) => ( state, event ) => {
  const form = state.data[group_id].forms[form_id]
  const variables = form.variables
  
  // Update inputted variable
  //console.log(event.target.name)
  const v = variables[variable_id]
  v[event.target.name] = event.target.value
  v.value = v.mantissa * Math.pow(10, v.exponent) * v.unit_ratio
  
  // Flatten values of variables
  const values = Object.fromEntries(Object.entries(variables).map(
    ([v_id, v]) => ([v_id, Number(v.value)])
  ))
  
  // Calculate other variables in order
  // Don't run if any variable besides the first-to-be-calculated is invalid
  if(Object.keys(values).every(v_id => (v_id==form.order[0]) || isFinite(values[v_id])))
  for(const v_id of form.order) {
    if(v_id == variable_id && !self) continue
    const v = variables[v_id]
    const val = Number(v.formula(values))
    values[v_id] = val
    v.value = val
    const scientific = num_to_scientific(val / v.unit_ratio)
    v.mantissa = scientific.mantissa
    v.exponent = scientific.exponent
  }
  return { ...state }
}

const Reorder = (group_id, form_id, variable_id) => ( state, event ) => {
  const form = state.data[group_id].forms[form_id]
  const variables = form.variables

  // Move current variable to last in calculation order
  form.order.push(form.order.splice(form.order.indexOf(variable_id), 1)[0])
  
  for(const v_id of form.order) {
    const i = form.order.indexOf(v_id) / (form.order.length - 1)
    variables[v_id].prefix = (
        i == 1 ? '➡️'
      : i == 0 ? '⭐'
      : ''
    )
  }
  
  return { ...state }
}

const compress_match = q => q.toLowerCase().replaceAll(/\W/g,"")
const Filter = (state, event) => {
  state.filter = compress_match(event.target.value)
  return { ...state }
}

const sign = x => ({
  positive: x > 0,
  zero: x == 0,
  negative: x < 0,
  invalid: !isFinite(x)
})

const ChangeUnit = (group_id, form_id, variable_id) => (state, event) => {
  const form = state.data[group_id].forms[form_id]
  const variables = form.variables
  
  const v = variables[variable_id]
  v.unit = event.target.value
  v.unit_ratio = factorOfUnit(v.unit) / factorOfUnit(v.default_unit)
  return Calculate(group_id, form_id, variable_id, true)(state, event)
}
const unitDropdown = (props, unit) =>
  select(props, Object.keys(units[kindOfUnit(unit)]).map(u => 
    option({ selected: unit == u }, text(u))
  ))
  
const formula = (variable) => 
  text(
    variable.symbol +
    variable.formula.toString()
    .replaceAll("**","^")
    .replace(/.*\=\>/," = ")
  )

app({
  init: { data, filter: "" },
  view: ({ data, filter }) =>
    main([
      h1(text('ASTROFORMULATRON')),
      p(text('An astronomy calculator by Xing')),
      ...Object.entries(data).map(([g_id, g]) => 
        section({class: "group", id: g_id}, [
          h2(a({href: "#"+g_id}, text(g.name))),
          ul({class: "forms"}, Object.entries(g.forms).map(([f_id, f]) => 
            compress_match(f.name).includes(filter) && li({class: "form", id: f_id}, form([
              details([
                summary(h3(text(f.name))),
                f.description && p(text(f.description)),
                code(formula(f.variables[f.order[0]]))
              ]),
              ul({class: "variables"}, Object.entries(f.variables).map(([v_id, v]) => 
                li({class: "variable", id: v_id}, label([
                  span({class: "name"}, text(v.name)),
                  span({class: "prefix"}, text(v.prefix || '')),
                  span({class: "definition"}, [
                    span({class: "symbol"}, text(v.symbol)),
                    span(text("=")),
                    input({
                      type: "number", 
                      name: "mantissa",
                      class: sign(v.mantissa),
                      step: 0.1,
                      value: v.mantissa,
                      oninput: Calculate(g_id, f_id, v_id),
                      onchange: Calculate(g_id, f_id, v_id, true),
                      onfocus: Reorder(g_id, f_id, v_id),
                    }),
                    text(" × 10"),
                    input({
                      type: "number",
                      name: "exponent",
                      class: sign(v.exponent),
                      step: 1,
                      value: v.exponent,
                      oninput: Calculate(g_id, f_id, v_id),
                      onfocus: Reorder(g_id, f_id, v_id),
                    }),
                    v.unit && unitDropdown({
                      oninput: ChangeUnit(g_id, f_id, v_id)
                    }, v.unit)
                  ])
                ]))
              ))
            ]))
          )),
      ])),
      input({id: "filter", type: "text", placeholder: "🔍", oninput: Filter}),
      p({id: "credits"}, [
        text("Made by "),
        a({href: "https://x-ing.space"}, text("Xing")),
        text(" in 2023 with "),
        a({href: "https://github.com/jorgebucaran/hyperapp"}, text("Hyperapp")),
        text(" and "),
        a({href: "https://flems.io"}, text("flems.io")),
        text(". Released to the public domain under CC0. "),
        a({href: "https://github.com/flyorboom/astroformulatron"}, text("View the source code.")),
      ]),
    ])
  ,
  node: document.getElementById("app"),
})
