function inputField(field) {
    return `
        <label for="${field.name}">${field.label}</label>
        <input 
            type="${field.type}" 
            id="${field.name}" 
            name="${field.name}"
            placeholder="${field.placeholder}" 
            required
        >
    `;
}