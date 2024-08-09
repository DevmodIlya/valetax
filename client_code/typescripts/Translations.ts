export class Translations {
    public static get<ReturnType>(index: string): ReturnType|string {
        const storage = localStorage.getItem("translations");
        if (storage && storage !== "") {
            try {
                return JSON.parse(storage)[index];
            } catch (e) {
                return ""
            }
        }
        return ""
    }
}