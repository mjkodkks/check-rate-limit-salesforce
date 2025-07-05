/**
 * Represents a standard limit with a maximum value and a remaining value.
 */
export type Limit = {
  Max: number;
  Remaining: number;
};

/**
 * Represents the specific structure for PermissionSets, which includes a nested limit.
 */
export type PermissionSetsLimit = Limit & {
  CreateCustom: Limit;
};

/**
 * Defines the structure of the entire Salesforce limits API response object.
 */
export type SalesforceLimits = {
  AnalyticsExternalDataSizeMB: Limit;
  CdpAiInferenceApiMonthlyLimit: Limit;
  ConcurrentAsyncGetReportInstances: Limit;
  ConcurrentEinsteinDataInsightsStoryCreation: Limit;
  ConcurrentEinsteinDiscoveryStoryCreation: Limit;
  ConcurrentSyncReportRuns: Limit;
  ContentDistBandwidthLimitMB: Limit;
  ContentDistViewLimit: Limit;
  ContentPublicationLimit: Limit;
  DailyAnalyticsDataflowJobExecutions: Limit;
  DailyAnalyticsUploadedFilesSizeMB: Limit;
  DailyApiRequests: Limit;
  DailyAsyncApexExecutions: Limit;
  DailyAsyncApexTests: Limit;
  DailyBulkApiBatches: Limit;
  DailyBulkV2QueryFileStorageMB: Limit;
  DailyBulkV2QueryJobs: Limit;
  DailyDeliveredPlatformEvents: Limit;
  DailyDurableGenericStreamingApiEvents: Limit;
  DailyDurableStreamingApiEvents: Limit;
  DailyEinsteinDataInsightsStoryCreation: Limit;
  DailyEinsteinDiscoveryOptimizationJobRuns: Limit;
  DailyEinsteinDiscoveryPredictAPICalls: Limit;
  DailyEinsteinDiscoveryPredictionsByCDC: Limit;
  DailyEinsteinDiscoveryStoryCreation: Limit;
  DailyFunctionsApiCallLimit: Limit;
  DailyGenericStreamingApiEvents: Limit;
  DailyMetadataRetrievesWithDependencies: Limit;
  DailyStandardVolumePlatformEvents: Limit;
  DailyStreamingApiEvents: Limit;
  DailyWorkflowEmails: Limit;
  DataStorageMB: Limit;
  DurableStreamingApiConcurrentClients: Limit;
  FileStorageMB: Limit;
  HourlyAsyncReportRuns: Limit;
  HourlyDashboardRefreshes: Limit;
  HourlyDashboardResults: Limit;
  HourlyDashboardStatuses: Limit;
  HourlyElevateAsyncReportRuns: Limit;
  HourlyElevateSyncReportRuns: Limit;
  HourlyLongTermIdMapping: Limit;
  HourlyManagedContentPublicRequests: Limit;
  HourlyODataCallout: Limit;
  HourlyPublishedPlatformEvents: Limit;
  HourlyPublishedStandardVolumePlatformEvents: Limit;
  HourlyShortTermIdMapping: Limit;
  HourlySyncReportRuns: Limit;
  HourlyTimeBasedWorkflow: Limit;
  MassEmail: Limit;
  MaxContentDocumentsLimit: Limit;
  MonthlyEinsteinDiscoveryStoryCreation: Limit;
  Package2VersionCreates: Limit;
  Package2VersionCreatesWithoutValidation: Limit;
  PermissionSets: PermissionSetsLimit;
  PlatformEventTriggersWithParallelProcessing: Limit;
  PrivateConnectOutboundCalloutHourlyLimitMB: Limit;
  PublishCallbackUsageInApex: Limit;
  SingleEmail: Limit;
  StreamingApiConcurrentClients: Limit;
};