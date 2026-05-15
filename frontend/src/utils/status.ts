import { BUILD_STATUS } from '../types';

export interface StatusStyle {
  color: string;
  label: string;
  icon: 'building' | 'success' | 'failed' | 'queued' | 'cancelled';
}

export function getStatusStyle(status: number): StatusStyle {
  switch (status) {
    case BUILD_STATUS.BUILDING:
      return { color: '#9D8D00', label: 'Building', icon: 'building' };
    case BUILD_STATUS.SUCCESS:
      return { color: '#0A6900', label: 'Success', icon: 'success' };
    case BUILD_STATUS.FAILED:
      return { color: '#FF4752', label: 'Failed', icon: 'failed' };
    case BUILD_STATUS.QUEUED:
      return { color: '#0044AA', label: 'Queued', icon: 'queued' };
    case BUILD_STATUS.CANCELLED:
      return { color: '#FF4752', label: 'Cancelled', icon: 'cancelled' };
    default:
      return { color: '#868686', label: 'Unknown', icon: 'failed' };
  }
}

export function getStatusBgColor(status: number): string {
  switch (status) {
    case BUILD_STATUS.BUILDING: return 'rgba(157, 141, 0, 0.15)';
    case BUILD_STATUS.SUCCESS: return 'rgba(10, 105, 0, 0.15)';
    case BUILD_STATUS.FAILED: return 'rgba(255, 71, 82, 0.15)';
    case BUILD_STATUS.QUEUED: return 'rgba(0, 68, 170, 0.15)';
    case BUILD_STATUS.CANCELLED: return 'rgba(255, 71, 82, 0.10)';
    default: return 'rgba(134, 134, 134, 0.15)';
  }
}

export function isActiveStatus(status: number): boolean {
  return status === BUILD_STATUS.BUILDING || status === BUILD_STATUS.QUEUED;
}
