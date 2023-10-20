export interface FileInfo {
    type: "notificationPDF" | "attachment";
    id: string;
    name: string;
    title: string;
    description?: string;
    downloadId: string;
    available: boolean;
}
