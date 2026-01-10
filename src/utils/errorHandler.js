/**
 * 错误处理工具
 */

/**
 * 将错误转换为用户友好的消息
 */
export function getErrorMessage(error) {
  if (!error) return '发生未知错误';

  // 网络错误
  if (error.message?.includes('网络') || error.message?.includes('Network')) {
    return '网络连接失败，请检查网络设置后重试';
  }

  // 超时错误
  if (error.message?.includes('超时') || error.message?.includes('timeout')) {
    return '请求超时，请稍后重试';
  }

  // API 错误
  if (error.message?.includes('API') || error.message?.includes('status')) {
    return '服务暂时不可用，请稍后重试';
  }

  // 数据格式错误
  if (error.message?.includes('格式')) {
    return '数据格式错误，请重试';
  }

  // 默认错误消息
  return error.message || '操作失败，请稍后重试';
}

/**
 * 判断错误是否可重试
 */
export function isRetryableError(error) {
  if (!error) return false;

  const retryableMessages = [
    '网络',
    'Network',
    '超时',
    'timeout',
    'API',
    'status',
    '500',
    '502',
    '503',
  ];

  return retryableMessages.some(msg => 
    error.message?.includes(msg) || error.toString().includes(msg)
  );
}

/**
 * 错误日志记录
 */
export function logError(error, context = {}) {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });

  // 在生产环境中，可以发送到错误监控服务
  // if (import.meta.env.PROD) {
  //   sendToErrorTracking(error, context);
  // }
}

