// // utils/dateUtils.ts
// export const getNextSevenDates = (): string[] => {
//     const dates: string[] = [];
//     const today = new Date();
//     for (let i = 0; i < 7; i++) {
//       const date = new Date(today);
//       date.setDate(today.getDate() + i);
//       dates.push(date.toISOString().split('T')[0]); // Format: YYYY-MM-DD
//     }
//     return dates;
//   };
export const generateDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split('T')[0]); // Format: YYYY-MM-DD
    }
    return dates;
};
