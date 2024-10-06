export const downloadFile = (name: string, content: string) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([content], { type: "application/json" })
  );
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
