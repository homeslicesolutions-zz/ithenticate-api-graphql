import xmlrpc from "davexmlrpc";
import { ApolloError } from "apollo-server-express";
import { DataSource } from "apollo-datasource";
import HTMLtoDOCX from "html-to-docx";

export type IthenticateScalar = {
  [key: string]: string | number | boolean | Array<any> | null | undefined;
};

export interface ActionParams {
  action: string;
  params: IthenticateScalar;
}

export enum MimeType {
  docx = "application/msword",
  html = "text/html",
}

export type Upload = {
  filename: string;
  author_first: string;
  author_last: string;
  upload: string;
  upload_as_type?: MimeType | null;
  title: string;
};

export interface UploadParams extends IthenticateScalar {
  sid: string;
  folder: string;
  submit_to: number;
  uploads: Upload[];
}

export interface UploadActionParams {
  action: string;
  params: UploadParams;
}

export type Encoding =
  | "utf8"
  | "base64"
  | "ascii"
  | "utf-8"
  | "utf16le"
  | "ucs2"
  | "ucs-2"
  | "latin1"
  | "binary"
  | "hex"
  | undefined;

export interface ConversionParams {
  input: string;
  encoding: Encoding;
}

export interface ConversionOutput {
  encoding?: Encoding;
  output: Buffer;
}

export default class IthenticateDataSource extends DataSource {
  baseURL = "https://api.ithenticate.com/rpc";

  defaultEncoding: Encoding = "ascii";

  format = "xml";

  async request(args: ActionParams): Promise<IthenticateScalar> {
    const { action, params } = args;

    return new Promise((resolve, reject) => {
      xmlrpc.client(
        this.baseURL,
        action,
        [params],
        this.format,
        (err: { message: string }, data: IthenticateScalar) => {
          if (err) {
            console.error(err.message);
            reject(new ApolloError(err.message));
          }
          resolve(data);
        }
      );
    });
  }

  async convertHtmlToWordDocument(
    args: ConversionParams
  ): Promise<ConversionOutput> {
    const { input = "", encoding = this.defaultEncoding } = args;

    const output = await HTMLtoDOCX(input);

    return {
      encoding,
      output: (Buffer.from(output as any, encoding) as unknown) as Buffer,
    };
  }

  async uploadDocument(args: UploadActionParams): Promise<IthenticateScalar> {
    const { action, params } = args;

    // Bufferize each upload string
    const { uploads } = params;
    const newUploads = await Promise.all(
      uploads.map(async (uploadItem) => {
        let upload;

        const content = (uploadItem.upload || "").trim();

        // As Word document
        if (
          uploadItem.upload_as_type &&
          uploadItem.upload_as_type === MimeType.docx
        ) {
          upload = await HTMLtoDOCX(content);

          // As Raw HTML
        } else if (
          uploadItem.upload_as_type &&
          uploadItem.upload_as_type === MimeType.html
        ) {
          upload = Buffer.from(content, this.defaultEncoding as Encoding);

          // Pure string
        } else {
          upload = content;
        }

        return {
          ...uploadItem,
          upload,
        };
      })
    );

    const newParams = {
      ...params,
      uploads: newUploads,
    };

    return this.request({
      action,
      params: (newParams as unknown) as IthenticateScalar,
    });
  }
}
