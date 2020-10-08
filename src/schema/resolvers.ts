import {
  ConversionParams,
  ConversionOutput,
  ActionParams,
  UploadActionParams,
  IthenticateScalar,
} from "../dataSource/IthenticateAPI";

export default {
  Query: {
    ithenticateClient: (
      _root: any,
      args: ActionParams,
      ctx: { dataSources: any }
    ): Promise<IthenticateScalar> => {
      const { dataSources } = ctx;
      return dataSources.ithenticateAPI.request(args as ActionParams);
    },

    convertHtmlToWordDocument: (
      _root: any,
      args: ConversionParams,
      ctx: { dataSources: any }
    ): Promise<ConversionOutput> => {
      const { dataSources } = ctx;
      return dataSources.ithenticateAPI.convertHtmlToWordDocument(
        args as ConversionParams
      );
    },
  },
  Mutation: {
    ithenticateUpload: (
      _root: any,
      args: UploadActionParams,
      ctx: { dataSources: any }
    ): Promise<IthenticateScalar> => {
      const { dataSources } = ctx;
      return dataSources.ithenticateAPI.uploadDocument(
        args as UploadActionParams
      );
    },
  },
};
