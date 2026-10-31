export default async function ServerReport() {
  // Simulate a slow server-side operation.
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const generatedAt = new Date().toISOString();

  return (
    <article>
      <h3>Server-generated report</h3>

      <p>
        This component executed on the server.
      </p>

      <p>
        Generated at: {generatedAt}
      </p>
    </article>
  );
}
