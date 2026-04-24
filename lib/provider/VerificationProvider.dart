import 'package:flutter/material.dart';
import 'package:hallucination/service/verification.dart';
import 'package:hallucination/result/claimresult.dart';
class VerificationProvider extends ChangeNotifier {
  final VerificationService _service = VerificationService();
  
  List<claimResult> _results = [];
  bool _isLoading = false;

  List<claimResult> get results => _results;
  bool get isLoading => _isLoading;

  Future<void> verifyContent(String text) async {
    _isLoading = true;
    notifyListeners(); 
    try {
      _results = await _service.postAndVerify(text);
      print("Got the result");
    } catch (e) {
      print("Error: $e");
    } finally {
      _isLoading = false;
      notifyListeners(); 
    }
  }

  Map<String, double> get stats {
  if (results.isEmpty) return {"Verified": 0, "False": 0, "Unverifiable": 100};
  
  double verified = results.where((r) => r.verdict == 'verified').length.toDouble();
  double falsy = results.where((r) => r.verdict == 'false').length.toDouble();
  double unverifiable = results.where((r) => r.verdict == 'unverifiable').length.toDouble();
  
  double total = results.length.toDouble();
  return {
    "Verified": (verified / total) * 100,
    "False": (falsy / total) * 100,
    "Unverifiable": (unverifiable / total) * 100,
  };
}
}