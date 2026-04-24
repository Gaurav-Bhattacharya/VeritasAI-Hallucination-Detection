class claimResult{
  final String claim;
  final String verdict;   
  final int confidence;  
  final String reason;
  final String source;
  claimResult({
    required this.claim,
    required this.verdict,
    required this.confidence,
    required this.reason,
    required this.source,
  });

  factory claimResult.fromJs(Map<String, dynamic> json, Map<String, dynamic> scoredJson) {
    return claimResult(
      claim: json['claim'] ?? '',
      verdict: scoredJson['verdict'] ?? 'unverifiable',
      confidence: scoredJson['confidence'] ?? 20,
      reason: scoredJson['reason'] ?? '',
      // Grab the source from the first evidence match if available
      source: (json['evidence'] != null && json['evidence'].isNotEmpty) 
          ? json['evidence'][0]['source'] 
          : 'Unknown',
    );
  }
}