import { createServiceInstance } from "./createService.service.js";



try {
    const res = await createServiceInstance({
        name: "sujay",
        domain: "cadcare.edusathi.net",
        subdomain: "admin.cadcare.edusathi.net",
        port: 4034
    });
    console.log(res)
} catch (err) {
    console.log(err)
}




console.log("sujay pradhan")