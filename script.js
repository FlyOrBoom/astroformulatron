import { app } from "https://unpkg.com/hyperapp"
import {
  main, section,
  h1, h2, h3,
  text, span, a, p,
  label,
  form,
  input,
  ul, li,
  summary, details,
} from "https://unpkg.com/@hyperapp/html?module"

const inrange = (a, x, b) => (a <= x) && (x <= b)
const log10 = (x) => Math.log(x) / Math.log(10)

const PI = Math.PI
const G = 6.6743E-11 // SI
const STEFAN = 5.670374419E-8 // SI
const WIEN = 2.897771955E-3 // SI
const EDDINGTON = 3.2E4 // solar units
const HUBBLE = 70 // km/s/Mpc

const data = {
  "stellar-relations": {
    name: "Stellar Relations",
    forms: {
      "distance-modulus": {
        name: "distance modulus",
        description: "relates the distance of an object to the difference between its apparent and absolute magnitudes",
        order: [ "d" , "M", "m" ],
        variables: {
          m: {
            name: "apparent magnitude",
            symbol: "m",
            value: 5, mantissa: 5, exponent: 0,
            formula: ({ d, M }) => ( (5*log10(d) - 5) + M ),
          },
          M: {
            name: "absolute magnitude",
            symbol: "M",
            value: -5, mantissa: -5, exponent: 0,
            formula: ({ d, m }) => ( m - (5*log10(d) - 5) ),
          },
          d: {
            name: "distance",
            symbol: "d",
            value: 1000, mantissa: 1, exponent: 3,
            unit: "parsecs",
            formula: ({ m, M }) => ( Math.pow(10, (m - M + 5) / 5) ),
          },
        },
      },
      "small-angle": {
        name: "small angle formula",
        description: "relates the distance of an object by the ratio of its angular and linear diameters",
        order: [ "D", "d", "θ" ],
        variables: {
          θ: {
            name: "angular diameter ",
            symbol: "θ",
            value: 10, mantissa: 1, exponent: 1,
            unit: "arcseconds",
            formula: ({ d, D }) => ( 206265*d/D ),
          },
          d: {
            name: "linear diameter",
            symbol: "d",
            value: 5, mantissa: 5, exponent: 0,
            unit: "$Length",
            formula: ({ θ, D }) => ( θ*D/206265 ),
          },
          D: {
            name: "distance",
            symbol: "D",
            value: 1e5, mantissa: 1, exponent: 5,
            unit: "$Length",
            formula: ({ θ, d }) => ( d*206265/θ )
          },
        },
      },
      "parallax": {
        name: "parallax distance",
        description: "relates the distance of an object by its parallax",
        order: [ "p", "d" ],
        variables: {
          d: {
            name: "distance",
            symbol: "d",
            value: 10, mantissa: 1, exponent: 1,
            unit: "parsecs",
            formula: ({ p }) => ( 1/p ),
          },
          p: {
            name: "parallax",
            symbol: "p",
            value: 0.1, mantissa: 1, exponent: -1,
            unit: "arcseconds",
            formula: ({ d }) => ( 1/d ),
          },
        },
      },
      "magnitude-luminosity": {
        name: "magnitude-luminosity relation",
        description: "relates two objects' luminosity ratio to magnitude difference",
        order: [ "M2", "M1", "L2", "L1" ],
        variables: {
          L1: {
            name: "1's luminosity",
            symbol: "L₁",
            value: 3e+11, mantissa: 3, exponent: 10,
            unit: "Watts",
            formula: ({ L2, M2, M1 }) => ( L2 * Math.pow(100, (M2 - M1) / 5) ),
          },
          L2: {
            name: "2's luminosity",
            symbol: "L₂",
            value: 3e+8, mantissa: 1, exponent: 8,
            unit: "Watts",
            formula: ({ L1, M2, M1 }) => ( L1 / Math.pow(100, (M2 - M1) / 5) ),
          },
          M1: {
            name: "1's magnitude",
            symbol: "M₁",
            value: 1e+1, mantissa: 1, exponent: 1,
            unit: "",
            formula: ({ L1, L2, M2 }) => ( M2 - 2.5 * log10(L1 / L2) ),
          },
          M2: {
            name: "2's magnitude",
            symbol: "M₂",
            value: 1.5e+1, mantissa: 1.5, exponent: 1,
            unit: "",
            formula: ({ L1, L2, M1 }) => ( M1 + 2.5 * log10(L1 / L2) ),
          },
        },
      },
      "mass-luminosity": {
        name: "mass-luminosity relation",
        description: "relates a main-sequence star's mass to its luminosity",
        order: [ "M", "L" ],
        variables: {
          L: {
            name: "luminosity",
            symbol: "L",
            value: 10, mantissa: 1, exponent: 1,
            unit: "L⊙",
            formula: ({ M }) => ( 
                inrange(0.00, M, 0.43) ? 0.23 * Math.pow(M, 2.3)
              : inrange(0.43, M, 2.00) ? 1.00 * Math.pow(M, 4.0)
              : inrange(2.00, M, 55.0) ? 1.40 * Math.pow(M, 3.5)
              : inrange(55.0, M, 1000) ? 32000 * Math.pow(M, 1.0)
              : NaN
            ),
          },
          M: {
            name: "mass",
            symbol: "M",
            value: 10, mantissa: 1, exponent: 1,
            unit: "M⊙",
            formula: ({ L }) => ( Math.pow(L/1.40, 1/3.5) ),
          },
        },
      },
      "stefan-boltzmann": {
        name: "Stefan-Boltzmann Law",
        description: "relates an object's luminous flux to its temperature",
        order: [ "T", "R", "F", "L" ],
        variables: {
          L: {
            name: "luminosity",
            symbol: "L",
            value: 10, mantissa: 1, exponent: 1,
            unit: "Watts",
            formula: ({ R, F }) => ( 4 * PI * (R*R) * F),
          },
          R: {
            name: "radius",
            symbol: "R",
            value: 10, mantissa: 1, exponent: 1,
            unit: "meters",
            formula: ({ L, F }) => ( Math.sqrt(L / (4 * PI * F)) ),
          },
          F: {
            name: "flux",
            symbol: "F",
            value: 10, mantissa: 1, exponent: 1,
            unit: "Watts / meters²",
            formula: ({ T }) => ( STEFAN * T*T*T*T )
          },
          T: {
            name: "temperature",
            symbol: "T",
            value: 10, mantissa: 1, exponent: 1,
            unit: "meters",
            formula: ({ F }) => ( Math.pow(F/STEFAN, 0.25) ),
          },
        },
      },
      "wien": {
        name: "Wien's Displacement Law",
        description: "relates a blackbody peak radiation wavelength to its temperature",
        order: [ "T", "λ" ],
        variables: {
          λ: {
            name: "peak wavelength",
            symbol: "λ",
            value: 0.05, mantissa: 5, exponent: -2,
            unit: "meters",
            formula: ({ T }) => ( WIEN / T ),
          },
          T: {
            name: "temperature",
            symbol: "T",
            value: 0.06, mantissa: 6, exponent: -2,
            unit: "Kelvin",
            formula: ({ λ }) => ( WIEN / λ ),
          },
        },
      },
      "eddington": {
        name: "Eddington Luminosity",
        description: "the maximum possible luminosity for a star before radiation pressure overcomes surface gravity",
        order: [ "M", "L" ],
        variables: {
          L: {
            name: "luminosity",
            symbol: "L",
            value: 32000, mantissa: 3.2, exponent: 4,
            unit: "L⊙",
            formula: ({ M }) => ( EDDINGTON * M ),
          },
          M: {
            name: "mass",
            symbol: "M",
            value: 1, mantissa: 1, exponent: 0,
            unit: "M⊙",
            formula: ({ L }) => ( L / EDDINGTON ),
          },
        },
      },
      "leavitt-classical": {
        name: "period-luminosity relation (Leavitt Law), Classical Cepheids",
        order: [ "P", "M_V" ],
        variables: {
          M_V: {
            name: "visual absolute magnitude",
            symbol: "Mᵥ",
            value: -4.05, mantissa: -4.05, exponent: 0,
            unit: "",
            formula: ({ P }) => ( -2.43 * (log10(P) - 1) - 4.05 ),
          },
          P: {
            name: "period",
            symbol: "P",
            value: 10, mantissa: 1, exponent: 1,
            unit: "days",
            formula: ({ M_V }) => ( Math.pow(10, (M_V + 4.05)/(-2.43) + 1) ),
          },
        },
      },
      "leavitt-ii": {
        name: "period-luminosity relation (Leavitt Law), Type II Cepheids",
        order: [ "P", "M_V" ],
        variables: {
          M_V: {
            name: "visual absolute magnitude",
            symbol: "Mᵥ",
            value: -2.66, mantissa: -2.66, exponent: 0,
            unit: "",
            formula: ({ P }) => ( -2.81 * log10(P) + 0.15 ),
          },
          P: {
            name: "period",
            symbol: "P",
            value: 10, mantissa: 1, exponent: 1,
            unit: "days",
            formula: ({ M_V }) => ( Math.pow(10, (M_V + 0.15)/(-2.81)) ),
          },
        },
      },
      "lifespan": {
        name: "lifespan",
        description: "relates the lifespan of a main-sequence star to its mass",
        order: [ "M", "t" ],
        variables: {
          t: {
            name: "lifespan",
            symbol: "t",
            value: 1e+10, mantissa: 1, exponent: 10,
            unit: "years",
            formula: ({ M }) => ( Math.pow(M, 2.5) * 1E10 ),
          },
          M: {
            name: "mass",
            symbol: "M",
            value: 1e+1, mantissa: 1, exponent: 1,
            unit: "M⊙",
            formula: ({ t }) => ( Math.pow(t*1E-10, 1/2.5) ),
          },
        },
      },
    }
  },
  "orbital-mechanics": {
    name: "Orbital Mechanics",
    forms: {
      "center-of-mass": {
        name: "center of mass",
        description: "relates center of mass of two objects to their masses and positions",
        order: [ "X", "µ", "m2", "m1", "x2", "x1" ],
        variables: {
          x1: {
            name: "1's position",
            symbol: "x₁",
            value: 1, mantissa: 1, exponent: 0,
            unit: "$Length",
            formula: ({ m1, m2, x2, X }) => ( (X*(m1 + m2) - x2*m2)/m1 ),
          },
          x2: {
            name: "2's position",
            symbol: "x₂",
            value: 3, mantissa: 3, exponent: 0,
            unit: "$Length",
            formula: ({ m1, m2, x1, X }) => ( (X*(m1 + m2) - x1*m1)/m2 ),
          },
          m1: {
            name: "1's mass",
            symbol: "m₁",
            value: 1, mantissa: 1, exponent: 0,
            unit: "$Mass",
            formula: ({ m2, x1, x2, X }) => ( m2 * (x2 - X) / (X - x1) ),
          },
          m2: {
            name: "2's mass",
            symbol: "m₂",
            value: 1, mantissa: 1, exponent: 0,
            unit: "$Mass",
            formula: ({ m1, x1, x2, X }) => ( m1 * (x1 - X) / (X - x2) ),
          },          
          µ: {
            name: "reduced mass",
            symbol: "µ",
            value: 5e-1, mantissa: 5, exponent: -1,
            unit: "Mass",
            formula: ({ m1, m2 }) => ( m1*m2 / (m1+m2) ),
          },
          X: {
            name: "center of mass",
            symbol: "X",
            value: 2, mantissa: 2, exponent: 0,
            unit: "$Length",
            formula: ({ m1, m2, x1, x2 }) => ( (m1*x1 + m2*x2) / (m1 + m2) ),
          },
        },
      },
      "newton-gravitation": {
        name: "Newton's Law of Universal Gravitation",
        description: "relates the force of gravity between two objects to their masses and distance",
        order: [ "F", "r", "m1", "m2" ],
        variables: {
          m1: {
            name: "1's mass",
            symbol: "m₁",
            value: 1, mantissa: 1, exponent: 0,
            unit: "kilograms",
            formula: ({ m2, F, r }) => ( F*r*r/G/m2 ),
          },
          m2: {
            name: "2's mass",
            symbol: "m₂",
            value: 2e15, mantissa: 2, exponent: 15,
            unit: "kilograms",
            formula: ({ m1, F, r }) => ( F*r*r/G/m1 ),
          },          
          r: {
            name: "distance",
            symbol: "r",
            value: 60, mantissa: 6, exponent: 1,
            unit: "meters",
            formula: ({ m1, m2, F }) => ( Math.sqrt(G*m1*m2/F) ),
          },
          F: {
            name: "gravitational force",
            symbol: "F",
            value: 37, mantissa: 3.7, exponent: 1,
            unit: "Newtons",
            formula: ({ m1, m2, r }) => ( G*m1*m2/r/r ),
          },
        },
      },
      "vis-viva": {
        name: "orbital speed (vis-viva)",
        description: "relates the speed of an object to its orbital radius and semi-major axis",
        order: [ "v", "r", "a", "m1", "m2" ],
        variables: {
          m1: {
            name: "1's mass",
            symbol: "m₁",
            value: 1e10, mantissa: 1, exponent: 10,
            unit: "kilograms",
            formula: ({ m2, a, r, v }) => ( v*v/G/(2/r - 1/a) - m2 ),
          },
          m2: {
            name: "2's mass",
            symbol: "m₂",
            value: 2e10, mantissa: 2, exponent: 10,
            unit: "kilograms",
            formula: ({ m1, a, r, v }) => ( v*v/G/(2/r - 1/a) - m1 ),
          },          
          r: {
            name: "distance",
            symbol: "r",
            value: 2, mantissa: 2, exponent: 0,
            unit: "meters",
            formula: ({ m1, m2, a, v }) => ( 2/(v*v/G/(m1 + m2) + 1/a) ),
          },
          a: {
            name: "semi-major axis",
            symbol: "a",
            value: 3, mantissa: 3, exponent: 0,
            unit: "meters",
            formula: ({ m1, m2, r, v }) => ( 1/(2/r - v*v/G/(m1 + m2)) ),
          },
          v: {
            name: "orbital speed",
            symbol: "v",
            value: 1.15, mantissa: 1.15, exponent: 0,
            unit: "meters/second",
            formula: ({ m1, m2, r, a }) => ( Math.sqrt(G*(m1+m2)*(2/r - 1/a)) ),
          },
        },
      },
    },
  },
  "large-scale-universe": {
    name: "Large-Scale Universe",
    forms: {
      "hubble": {
        name: "Hubble's Law",
        description: "relates the recessional speed of an object to its distance, due to the expansion of the universe",
        order: [ "v", "d" ],
        variables: {
          v: {
            name: "recessional speed",
            symbol: "v",
            value: 1, mantissa: 1, exponent: 0,
            unit: "kilometers/second",
            formula: ({ d }) => ( HUBBLE*d ),
          },
          d: {
            name: "distance",
            symbol: "d",
            value: 1, mantissa: 1, exponent: 0,
            unit: "megaparsecs",
            formula: ({ v }) => ( v/HUBBLE ),
          },
        },
      },
      "proper-motion": {
        name: "proper motion",
        description: "relates the tangential speed of an object to its distance and angular motion",
        order: [ "v", "µ", "d" ],
        variables: {
          d: {
            name: "distance",
            symbol: "d",
            value: 1, mantissa: 1, exponent: 0,
            unit: "parsecs",
            formula: ({ v, µ }) => ( v / 4.72 / µ ),
          },
          µ: {
            name: "proper motion",
            symbol: "µ",
            value: 1, mantissa: 1, exponent: 0,
            unit: "arcseconds/year",
            formula: ({ v, d }) => ( v / 4.72 / d ),
          },
          v: {
            name: "tangential speed",
            symbol: "v",
            value: 1, mantissa: 1, exponent: 0,
            unit: "kilometers/second",
            formula: ({ µ, d }) => ( 4.72 * µ * d ),
          },
        },
      },
      "universe-age": {
        name: "age of the universe",
        description: "relates the age of the universe to Hubble Constant",
        order: [ "H", "t" ],
        variables: {
          t: {
            name: "age",
            symbol: "t",
            value: 1, mantissa: 1, exponent: 0,
            unit: "years",
            formula: ({ H }) => ( 1e12 / H ),
          },
          H: {
            name: "Hubble constant",
            symbol: "H",
            value: 1, mantissa: 1, exponent: 0,
            unit: "kilometers/second/megaparsec",
            formula: ({ t }) => ( 1e12 / t ),
          }
        },
      },
      "z-factor": {
        name: "z-factor",
        description: "relates the z-factor to wavelength dilation from the cosmic microwave background",
        order: [ "z", "λ", "λ0" ],
        variables: {
          λ: {
            name: "wavelength",
            symbol: "λ",
            value: 2, mantissa: 2, exponent: 0,
            unit: "$Length",
            formula: ({ λ0, z }) => ( λ0*(z + 1) ),
          },
          λ0: {
            name: "original wavelength",
            symbol: "λ₀",
            value: 1, mantissa: 1, exponent: 0,
            unit: "$Length",
            formula: ({ λ, z }) => ( λ/(z + 1) ),
          },
          z: {
            name: "z-factor",
            symbol: "z",
            value: 1, mantissa: 1, exponent: 0,
            unit: "",
            formula: ({ λ, λ0 }) => ( λ/λ0 - 1 ),
          },
        },
      },
    },
  },
  "telescopes": {
    name: "Telescopes & Lenses",
    forms: {
      "resolving-power": {
        name: "resolving power",
        description: "relates the angular resolution of a lens to its aperture and the wavelength",
        order: [ "D", "λ", "θ" ],
        variables: {
          θ: {
            name: "angular resolution",
            symbol: "θ",
            value: 1.22, mantissa: 1.22, exponent: 0,
            unit: "radians",
            formula: ({ λ, D }) => ( 1.22*λ/D ),
          },
          λ: {
            name: "wavelength",
            symbol: "λ",
            value: 1, mantissa: 1, exponent: 0,
            unit: "$Length",
            formula: ({ θ, D }) => ( θ*D/1.22 ),
          },
          D: {
            name: "lens diameter",
            symbol: "D",
            value: 1, mantissa: 1, exponent: 0,
            unit: "$Length",
            formula: ({ θ, λ }) => ( 1.22*λ/θ )
          },
        },
      },
    }
  }
}

const num_to_scientific = (x) => {
  const arr = Number
  .parseFloat(x)
  .toExponential()
  .split("e")
  .map(n => Number.parseFloat(n))
  return {
    mantissa: arr[0],
    exponent: arr[1]
  }
}

const Calculate = (group_id, form_id, variable_id) => ( state, event ) => {
  const form = state.data[group_id].forms[form_id]
  const variables = form.variables
  
  // Update inputted variable
  //console.log(event.target.name)
  variables[variable_id][event.target.name] = event.target.value
  variables[variable_id].value = variables[variable_id].mantissa * Math.pow(10, variables[variable_id].exponent)
  
  // Flatten values of variables
  const values = Object.fromEntries(Object.entries(variables).map(
    ([v_id, v]) => ([v_id, Number(v.value)])
  ))
  
  // Calculate variables in order
  if(Object.values(values).every(val => isFinite(val)))
  for(const v_id of form.order) {
    const v = variables[v_id]
    let val = Number(v.formula(values))
    values[v_id] = val
    v.value = val
    const scientific = num_to_scientific(val)
    v.mantissa = Number(scientific.mantissa.toPrecision(5))
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
                f.description && span(text(f.description))
              ]),
              ul({class: "variables"}, Object.entries(f.variables).map(([v_id, v]) => 
                li({class: "variable", id: v_id}, label([
                  span({class: "name"}, text(v.name)),
                  span({class: "prefix"}, text(v.prefix || '')),
                  span({class: "symbol"}, text(v.symbol)),
                  span(text("=")),
                  input({
                    type: "number", 
                    name: "mantissa",
                    class: sign(v.mantissa),
                    step: 0.1,
                    value: v.mantissa,
                    oninput: Calculate(g_id, f_id, v_id),
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
                  v.unit && text(v.unit)
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
        a({href: "https://flems.io"}, text("flems.io")),
        text(" and "),
        a({href: "https://github.com/jorgebucaran/hyperapp"}, text("hyperapp.js")),
      ]),
    ])
  ,
  node: document.getElementById("app"),
})