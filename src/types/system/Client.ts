import { RoleRecord } from '@/types/system/Role';

export interface ClientRecord {
  id?: string;
  createTime?: any;
  updateTime?: any;
  clientId: string;
  clientName: string;
  resourceIds: string;
  clientSecret: string;
  clientSecretStr: string;
  scope: string;
  authorizedGrantTypes: string;
  webServerRedirectUri?: any;
  authorities: string;
  accessTokenValiditySeconds: number;
  refreshTokenValiditySeconds: number;
  additionalInformation: string;
  autoapprove: string;
  supportIdToken: boolean;
  idTokenValiditySeconds: number;
  ifLimit: number;
  limitCount: string;
}
