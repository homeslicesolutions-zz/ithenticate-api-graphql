import { gql } from "apollo-server";

export default gql`
  scalar IthenticateScalar

  type ConversionOutput {
    encoding: String!
    output: IthenticateScalar
  }

  type Query {
    ithenticateClient(
      action: String!
      params: IthenticateScalar!
    ): IthenticateScalar

    convertHtmlToWordDocument(
      input: String!
      encoding: String
    ): ConversionOutput
  }

  type Mutation {
    ithenticateUpload(
      action: String!
      params: IthenticateScalar!
    ): IthenticateScalar
  }
`;
