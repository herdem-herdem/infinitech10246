// Functions catch-all for TanStack Start SSR
export const onRequest: PagesFunction = async (context) => {
  try {
    // SSR build çıktısını import etmeye çalış
    // @ts-ignore
    const { default: handler } = await import("../dist/server/index.js");
    
    if (handler && typeof handler.fetch === "function") {
      return await handler.fetch(context.request, context.env, context);
    }
    
    return new Response("SSR Handler not found", { status: 500 });
  } catch (err) {
    // Eğer dosya henüz build edilmemişse veya bulunamazsa statik dosyaları dene
    return context.next();
  }
};
