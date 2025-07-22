//
// Generic “class-names” helper used по всему проекту.
// Его задача — безопасно склеивать массив классов в одну строку.
//
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ")
}
