import type { ResourceConfig, ResourceType } from './architecture';

export interface ResourceField {
  key: string;
  label: string;
  input: 'text' | 'number' | 'checkbox';
}

export interface ResourceDefinition {
  type: ResourceType;
  label: string;
  category: 'Network' | 'Compute' | 'Storage' | 'Identity';
  color: string;
  fields: ResourceField[];
  defaults: ResourceConfig;
}

const field = (key: string, label: string, input: ResourceField['input'] = 'text'): ResourceField => ({ key, label, input });

export const RESOURCE_DEFINITIONS: ResourceDefinition[] = [
  { type: 'VPC', label: 'VPC', category: 'Network', color: 'teal', fields: [field('cidr', 'IPv4 CIDR'), field('enableDnsSupport', 'DNS support', 'checkbox'), field('enableDnsHostnames', 'DNS hostnames', 'checkbox')], defaults: { cidr: '10.0.0.0/16', enableDnsSupport: true, enableDnsHostnames: true } },
  { type: 'Subnet', label: 'Subnet', category: 'Network', color: 'teal', fields: [field('cidr', 'IPv4 CIDR'), field('availabilityZone', 'Availability zone'), field('publicIpOnLaunch', 'Assign public IPv4', 'checkbox')], defaults: { cidr: '10.0.1.0/24', availabilityZone: 'ap-northeast-1a', publicIpOnLaunch: false } },
  { type: 'RouteTable', label: 'Route table', category: 'Network', color: 'teal', fields: [field('routeCount', 'Route entries', 'number')], defaults: { routeCount: 1 } },
  { type: 'InternetGateway', label: 'Internet gateway', category: 'Network', color: 'teal', fields: [field('attached', 'Attached', 'checkbox')], defaults: { attached: false } },
  { type: 'NatGateway', label: 'NAT gateway', category: 'Network', color: 'teal', fields: [field('elasticIpPresent', 'Elastic IP assigned', 'checkbox'), field('state', 'State')], defaults: { elasticIpPresent: true, state: 'available' } },
  { type: 'SecurityGroup', label: 'Security group', category: 'Network', color: 'teal', fields: [field('description', 'Description')], defaults: { description: 'Security boundary' } },
  { type: 'EC2', label: 'EC2 instance', category: 'Compute', color: 'coral', fields: [field('instanceType', 'Instance type'), field('state', 'Scenario state')], defaults: { instanceType: 't3.micro', state: 'running' } },
  { type: 'ALB', label: 'Load balancer', category: 'Compute', color: 'coral', fields: [field('scheme', 'Scheme')], defaults: { scheme: 'internet-facing' } },
  { type: 'RDS', label: 'RDS database', category: 'Storage', color: 'gold', fields: [field('engine', 'Engine'), field('port', 'Port', 'number'), field('multiAz', 'Multi-AZ', 'checkbox')], defaults: { engine: 'postgres', port: 5432, multiAz: false } },
  { type: 'S3', label: 'S3 bucket', category: 'Storage', color: 'gold', fields: [field('blockPublicAccess', 'Block public access', 'checkbox'), field('versioningEnabled', 'Versioning', 'checkbox')], defaults: { blockPublicAccess: true, versioningEnabled: false } },
  { type: 'IAMRole', label: 'IAM role', category: 'Identity', color: 'blue', fields: [field('trustedService', 'Trusted service')], defaults: { trustedService: 'ec2.amazonaws.com' } },
  { type: 'IAMPolicy', label: 'IAM policy', category: 'Identity', color: 'blue', fields: [field('effect', 'Effect'), field('actions', 'Actions')], defaults: { effect: 'Allow', actions: 's3:GetObject' } },
];

export function getResourceDefinition(type: ResourceType): ResourceDefinition {
  return RESOURCE_DEFINITIONS.find((definition) => definition.type === type)!;
}