import 'package:flutter/material.dart';
import 'package:hallucination/result/claimresult.dart';
class ResultCard extends StatelessWidget {
  final claimResult result;
  const ResultCard({super.key, required this.result});

  Color getStatusColor() {
    if (result.verdict== 'verified') return const Color(0xFF22C55E);
    if (result.verdict == 'unverifiable') return const Color(0xFFEAB308);
    return const Color(0xFFEF4444);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 450,
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color:getStatusColor().withOpacity(0.6), // Card color from your spec
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(result.reason, style: const TextStyle(color: Colors.white, fontSize: 16)),
          const SizedBox(height: 12),
          // The Confidence "Status Bar"
          LinearProgressIndicator(
            value: result.confidence/100,
            backgroundColor: Colors.white10,
            color: getStatusColor(),
            minHeight: 6,
          ),
          Center(child: Text("${result.confidence.toString()}",style: TextStyle(color:getStatusColor()),)),
          const SizedBox(height: 8),
          Text("Source: ${result.source}", style: const TextStyle(color: Colors.grey, fontSize: 12)),
        ],
      ),
    );
  }
}