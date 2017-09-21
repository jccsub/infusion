

export class PathRewriter {
    public static rewrite(path, req) {
    (req as any).newPath = '';
    // Any additional logic here
    if (req.newPath) {
      return req.newPath;
    }
  }
}
  