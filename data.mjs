const inrange = (a, x, b) => (a <= x) && (x <= b)
const log10 = (x) => Math.log(x) / Math.log(10)

const PI = Math.PI
const G = 6.6743E-11 // SI
const STEFAN = 5.670374419E-8 // SI
const WIEN = 2.897771955E-3 // SI
const EDDINGTON = 3.2E4 // solar units
const HUBBLE = 70 // km/s/Mpc

export const data = {
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
            value: 5,
            formula: ({ d, M }) => ( (5*log10(d) - 5) + M ),
          },
          M: {
            name: "absolute magnitude",
            symbol: "M",
            value: -5,
            formula: ({ d, m }) => ( m - (5*log10(d) - 5) ),
          },
          d: {
            name: "distance",
            symbol: "d",
            value: 1000,
            unit: "parsecs",
            formula: ({ m, M }) => ( 10 ** ((m - M + 5) / 5) ),
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
            value: 10,
            unit: "arcseconds",
            formula: ({ d, D }) => ( 206265*d/D ),
          },
          d: {
            name: "linear diameter",
            symbol: "d",
            value: 5,
            unit: "centimeters",
            formula: ({ θ, D }) => ( θ*D/206265 ),
          },
          D: {
            name: "distance",
            symbol: "D",
            value: 1e5,
            unit: "centimeters",
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
            value: 10,
            unit: "parsecs",
            formula: ({ p }) => ( 1/p ),
          },
          p: {
            name: "parallax",
            symbol: "p",
            value: 0.1,
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
            value: 3e+11,
            unit: "watts",
            formula: ({ L2, M2, M1 }) => ( L2 * (100 ** ((M2 - M1) / 5)) ),
          },
          L2: {
            name: "2's luminosity",
            symbol: "L₂",
            value: 3e+8,
            unit: "watts",
            formula: ({ L1, M2, M1 }) => ( L1 / (100 ** ((M2 - M1) / 5)) ),
          },
          M1: {
            name: "1's magnitude",
            symbol: "M₁",
            value: 1e+1,
            unit: "",
            formula: ({ L1, L2, M2 }) => ( M2 - 2.5 * log10(L1 / L2) ),
          },
          M2: {
            name: "2's magnitude",
            symbol: "M₂",
            value: 1.5e+1,
            unit: "",
            formula: ({ L1, L2, M1 }) => ( M1 + 2.5 * log10(L1 / L2) ),
          },
        },
      },
      "mass-luminosity": {
        name: "mass-luminosity relation, main-sequence",
        description: "relates a main-sequence star's mass to its luminosity",
        order: [ "M", "L" ],
        variables: {
          L: {
            name: "luminosity",
            symbol: "L",
            value: 10,
            unit: "L⊙",
            formula: ({ M }) => ( 
                inrange(0.00, M, 0.43) ? 0.23 * (M ** 2.3)
              : inrange(0.43, M, 2.00) ? 1.00 * (M ** 4.0)
              : inrange(2.00, M, 55.0) ? 1.40 * (M ** 3.5)
              : inrange(55.0, M, 1000) ? 32000 * (M ** 1.0)
              : NaN
            ), // TODO: implement
            formula: ({ M }) => 1.40 * (M ** 3.5)
          },
          M: {
            name: "mass",
            symbol: "M",
            value: 10,
            unit: "M⊙",
            formula: ({ L }) => ( (L/1.40) ** (1/3.5) ),
          },
        },
      },
      "stefan-boltzmann": {
        name: "Stefan-Boltzmann Law",
        description: "relates an object's luminous flux to its temperature",
        order: [ "T", "R", "L" ],
        variables: {
          L: {
            name: "luminosity",
            symbol: "L",
            value: 10,
            unit: "watts",
            formula: ({ R, T }) => ( 4 * PI * (R**2) * STEFAN * (T**4)),
          },
          R: {
            name: "radius",
            symbol: "R",
            value: 10,
            unit: "meters",
            formula: ({ L, T }) => ( (L / (4 * PI * STEFAN * (T**4))) ** (1/2) ),
          },
          T: {
            name: "temperature",
            symbol: "T",
            value: 10,
            unit: "meters",
            formula: ({ R, L }) => ( (L / (4 * PI * (R**2) * STEFAN)) ** (1/4) ),
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
            value: 0.05,
            unit: "meters",
            formula: ({ T }) => ( WIEN / T ),
          },
          T: {
            name: "temperature",
            symbol: "T",
            value: 0.06,
            unit: "kelvins",
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
            value: 32000,
            unit: "L⊙",
            formula: ({ M }) => ( EDDINGTON * M ),
          },
          M: {
            name: "mass",
            symbol: "M",
            value: 1,
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
            value: -4.05,
            unit: "",
            formula: ({ P }) => ( -2.43 * (log10(P) - 1) - 4.05 ),
          },
          P: {
            name: "period",
            symbol: "P",
            value: 10,
            unit: "days",
            formula: ({ M_V }) => ( 10 ** ((M_V + 4.05)/(-2.43) + 1) ),
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
            value: -2.66,
            unit: "",
            formula: ({ P }) => ( -2.81 * log10(P) + 0.15 ),
          },
          P: {
            name: "period",
            symbol: "P",
            value: 10,
            unit: "days",
            formula: ({ M_V }) => ( 10 ** ((M_V + 0.15)/(-2.81)) ),
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
            value: 1e+10,
            unit: "years",
            formula: ({ M }) => ( (M ** 2.5) * 1e+10 ),
          },
          M: {
            name: "mass",
            symbol: "M",
            value: 1e+1,
            unit: "M⊙",
            formula: ({ t }) => ( (t*1e-10) ** (1/2.5) ),
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
            value: 1,
            unit: "meters",
            formula: ({ m1, m2, x2, X }) => ( (X*(m1 + m2) - x2*m2)/m1 ),
          },
          x2: {
            name: "2's position",
            symbol: "x₂",
            value: 3,
            unit: "meters",
            formula: ({ m1, m2, x1, X }) => ( (X*(m1 + m2) - x1*m1)/m2 ),
          },
          m1: {
            name: "1's mass",
            symbol: "m₁",
            value: 1,
            unit: "kilograms",
            formula: ({ m2, x1, x2, X }) => ( m2 * (x2 - X) / (X - x1) ),
          },
          m2: {
            name: "2's mass",
            symbol: "m₂",
            value: 1,
            unit: "kilograms",
            formula: ({ m1, x1, x2, X }) => ( m1 * (x1 - X) / (X - x2) ),
          },          
          µ: {
            name: "reduced mass",
            symbol: "µ",
            value: 5e-1,
            unit: "kilograms",
            formula: ({ m1, m2 }) => ( m1*m2 / (m1+m2) ),
          },
          X: {
            name: "center of mass",
            symbol: "X",
            value: 2,
            unit: "meters",
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
            value: 1,
            unit: "kilograms",
            formula: ({ m2, F, r }) => ( F*r*r/G/m2 ),
          },
          m2: {
            name: "2's mass",
            symbol: "m₂",
            value: 2e15,
            unit: "kilograms",
            formula: ({ m1, F, r }) => ( F*r*r/G/m1 ),
          },          
          r: {
            name: "distance",
            symbol: "r",
            value: 60,
            unit: "meters",
            formula: ({ m1, m2, F }) => ( Math.sqrt(G*m1*m2/F) ),
          },
          F: {
            name: "gravitational force",
            symbol: "F",
            value: 37,
            unit: "newtons",
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
            value: 1e10,
            unit: "kilograms",
            formula: ({ m2, a, r, v }) => ( v*v/G/(2/r - 1/a) - m2 ),
          },
          m2: {
            name: "2's mass",
            symbol: "m₂",
            value: 2e10,
            unit: "kilograms",
            formula: ({ m1, a, r, v }) => ( v*v/G/(2/r - 1/a) - m1 ),
          },          
          r: {
            name: "distance",
            symbol: "r",
            value: 2,
            unit: "meters",
            formula: ({ m1, m2, a, v }) => ( 2/(v*v/G/(m1 + m2) + 1/a) ),
          },
          a: {
            name: "semi-major axis",
            symbol: "a",
            value: 3,
            unit: "meters",
            formula: ({ m1, m2, r, v }) => ( 1/(2/r - v*v/G/(m1 + m2)) ),
          },
          v: {
            name: "orbital speed",
            symbol: "v",
            value: 1.15,
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
            value: 1,
            unit: "kilometers/second",
            formula: ({ d }) => ( HUBBLE*d ),
          },
          d: {
            name: "distance",
            symbol: "d",
            value: 1,
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
            value: 1,
            unit: "parsecs",
            formula: ({ v, µ }) => ( v / 4.72 / µ ),
          },
          µ: {
            name: "proper motion",
            symbol: "µ",
            value: 1,
            unit: "arcseconds/year",
            formula: ({ v, d }) => ( v / 4.72 / d ),
          },
          v: {
            name: "tangential speed",
            symbol: "v",
            value: 1,
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
            value: 1,
            unit: "years",
            formula: ({ H }) => ( 1e12 / H ),
          },
          H: {
            name: "Hubble constant",
            symbol: "H",
            value: 1,
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
            value: 2,
            unit: "meters",
            formula: ({ λ0, z }) => ( λ0*(z + 1) ),
          },
          λ0: {
            name: "original wavelength",
            symbol: "λ₀",
            value: 1,
            unit: "meters",
            formula: ({ λ, z }) => ( λ/(z + 1) ),
          },
          z: {
            name: "z-factor",
            symbol: "z",
            value: 1,
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
            value: 1.22,
            unit: "radians",
            formula: ({ λ, D }) => ( 1.22*λ/D ),
          },
          λ: {
            name: "wavelength",
            symbol: "λ",
            value: 1,
            unit: "nanometers",
            formula: ({ θ, D }) => ( θ*D/1.22 ),
          },
          D: {
            name: "lens diameter",
            symbol: "D",
            value: 1,
            unit: "nanometers",
            formula: ({ θ, λ }) => ( 1.22*λ/θ )
          },
        },
      },
    }
  }
}
