import { calcNotAvailableDoctors } from "./autofilllogic";

const doctors = [
    {
      name: 'Dr. 1',
      id: 'dr1',
      emergencyDepartment: true,
      house: false,
      imc: false,
      wish: [ 23, 28, 16 ],
      noDutyWish: [
        11, 11, 13, 23, 26,
        18,  9,  3,  2,  1,
         2
      ],
      only12: false,
      clinic: 'Gastroenterologie'
    },
    {
      name: 'Dr. 2',
      id: 'dr2',
      emergencyDepartment: false,
      house: true,
      imc: true,
      wish: [ 12, 26, 21, 4 ],
      noDutyWish: [
        16, 14, 17,  3, 27,
        19,  6, 17, 20, 12
      ],
      only12: false,
      clinic: 'Gastroenterologie'
    },
    {
      name: 'Dr. 3',
      id: 'dr3',
      emergencyDepartment: false,
      house: true,
      imc: true,
      wish: [ 12, 26, 21, 4 ],
      noDutyWish: [
        16, 14, 17,  3, 27,
        19,  6, 17, 20, 12
      ],
      only12: true,
      clinic: 'Kardiologie'
    },
    {
      name: 'Dr. 4',
      id: 'dr4',
      emergencyDepartment: true,
      house: true,
      imc: true,
      wish: [ 12, 26, 21, 4 ],
      noDutyWish: [
        16, 14, 17,  3, 27,
        19,  6, 17, 20, 12
      ],
      only12: false,
      clinic: 'Kardiologie'
    }
  ]
const days = [
    {
      day: 1,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 6,
      holiday: false
    },
    {
      day: 2,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 0,
      holiday: false
    },
    {
      day: 3,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 1,
      holiday: false
    },
    {
      day: 4,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 2,
      holiday: true
    },
    {
      day: 5,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 3,
      holiday: false
    },
    {
      day: 6,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 4,
      holiday: false
    },
    {
      day: 7,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 5,
      holiday: false
    },
    {
      day: 8,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 6,
      holiday: false
    },
    {
      day: 9,
      imc: [],
      emergencyDepartment: [],
      house: ["dr2"],
      weekday: 0,
      holiday: false
    },
    {
      day: 10,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 1,
      holiday: false
    },
    {
      day: 11,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 2,
      holiday: false
    },
    {
      day: 12,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 3,
      holiday: false
    },
    {
      day: 13,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 4,
      holiday: false
    },
    {
      day: 14,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 5,
      holiday: false
    },
    {
      day: 15,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 6,
      holiday: false
    },
    {
      day: 16,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 0,
      holiday: false
    },
    {
      day: 17,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 1,
      holiday: false
    },
    {
      day: 18,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 2,
      holiday: false
    },
    {
      day: 19,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 3,
      holiday: true
    },
    {
      day: 20,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 4,
      holiday: true
    },
    {
      day: 21,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 5,
      holiday: false
    },
    {
      day: 22,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 6,
      holiday: false
    },
    {
      day: 23,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 0,
      holiday: true
    },
    {
      day: 24,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 1,
      holiday: false
    },
    {
      day: 25,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 2,
      holiday: false
    },
    {
      day: 26,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 3,
      holiday: false
    },
    {
      day: 27,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 4,
      holiday: false
    },
    {
      day: 28,
      imc: [],
      emergencyDepartment: [],
      house: [],
      weekday: 5,
      holiday: false
    }
  ]

test('Test calcNotAvailableDoctors-Function', () => {
        expect(calcNotAvailableDoctors(days, days[4], "emergencyDepartment", doctors)).toBe(1)
        expect(calcNotAvailableDoctors(days, days[8], "house", doctors)).toBe(2)
        expect(calcNotAvailableDoctors(days, days[8], "house", doctors)).toBe(2)
        expect(calcNotAvailableDoctors(days, days[8], "house", doctors)).toBe(2)
});
