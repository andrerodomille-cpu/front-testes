export interface AMIEvent {
  idConfig: string;
  evento: string | null;
  timestamp: string;
  dados: EventData;
}

export interface EventData {
  Privilege?: string;
  [key: string]: any;
}

export interface PeerStatusData extends EventData {
  ChannelType: string;
  Peer: string;
  PeerStatus: string;
  Address: string;
}

export interface NewChannelData extends EventData {
  Channel: string;
  ChannelState: string;
  ChannelStateDesc: string;
  CallerIDNum: string;
  CallerIDName: string;
  ConnectedLineNum: string;
  ConnectedLineName: string;
  Language: string;
  AccountCode: string;
  Context: string;
  Exten: string;
  Priority: string;
  Uniqueid: string;
  Linkedid: string;
}

export interface VarSetData extends EventData {
  Variable: string;
  Value: string;
  Channel?: string;
  ChannelState?: string;
  ChannelStateDesc?: string;
  CallerIDNum?: string;
  CallerIDName?: string;
  ConnectedLineNum?: string;
  ConnectedLineName?: string;
  Language?: string;
  AccountCode?: string;
  Context?: string;
  Exten?: string;
  Priority?: string;
  Uniqueid?: string;
  Linkedid?: string;
}

export interface NewExtenData extends EventData {
  Extension: string;
  Application: string;
  AppData: string;
  Channel?: string;
  ChannelState?: string;
  ChannelStateDesc?: string;
  CallerIDNum?: string;
  CallerIDName?: string;
  ConnectedLineNum?: string;
  ConnectedLineName?: string;
  Language?: string;
  AccountCode?: string;
  Context?: string;
  Exten?: string;
  Priority?: string;
  Uniqueid?: string;
  Linkedid?: string;
}

export interface DeviceStatus {
  peer: string;
  address: string;
  timestamp: string;
}

export interface CallInfo {
  uniqueid: string;
  channel: string;
  caller: string;
  destination: string;
  startTime: string;
  status: string;
}

export interface FilterState {
  eventType: string;
  searchTerm: string;
  timeRange: string;
}

export interface StatsState {
  total: number;
  byType: Record<string, number>;
  registeredDevices: DeviceStatus[];
  activeCalls: CallInfo[];
  recentCalls: CallInfo[];
}