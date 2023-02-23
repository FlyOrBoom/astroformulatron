const PI = Math.PI

const units = {
  length: { // base: meters
    "angstroms": 1e-10,
    "nanometers": 1e-9, 
    "centimeters": 1e-2,
    "meters": 1,
    "kilometers": 1e+3, 
    "R⊙": 6.957e+8, 
    "AUs": 1.496e+11, 
    "light-years": 9.461e+15, 
    "parsecs": 3.086e+16, 
    "kiloparsecs": 3.086e+19,
    "megaparsecs": 3.086e+22,
  },
  angle: { // base: degrees
    "milliarcseconds": 1e-3/360,
    "arcseconds": 1/360,
    "arcminutes": 1/60,
    "degrees": 1,
    "radians": 180/PI,
  },
  time: { // base: seconds
    "seconds": 1,
    "minutes": 60,
    "hours": 360,
    "days": 86400,
    "years": 31557600,
  },
  power: { // base: watts
    "watts": 1,
    "megawatts": 1e6,
    "gigawatts": 1e9,
    "terawatts": 1e12,
    "L⊙": 3.828e+26,
  },
  force: { // base: newtons
    "dynes": 1e-5,
    "newtons": 1,
  },
  temperature: { // base: kelvins
    "kelvins": 1,
    "rankines": 5/9,
    "T⊙": 5778,
  },
  speed: { // base: m/s
    "meters/second": 1,
    "kilometers/second": 1e3,
  },
  frequency: { // base: hertz
    "hertz": 1,
    "kilometers/second/megaparsec": 3.086e+19,
  },
  angular_speed: { // base: degrees per second
    "degrees/second": 1,
    "arcseconds/year": 87660,
  },
  mass: { // base: kilograms
    "grams": 1e-3,
    "kilograms": 1,
    "M⊙": 1.9891e+30,
  }
}

const kindOfUnit = (unit) => Object.keys(units)
  .find(kind => Object.keys(units[kind]).includes(unit))
  
const factorOfUnit = (unit) => units[kindOfUnit(unit)][unit]

export {
  units,
  kindOfUnit,
  factorOfUnit
}
