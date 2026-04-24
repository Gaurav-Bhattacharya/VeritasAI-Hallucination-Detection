import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:hallucination/result/claimresult.dart';
class VerificationService {
  final String _baseUrl = 'https://veritasai-hallucination-detection.onrender.com/api/verify';

  Future<List<claimResult>> postAndVerify(String llmOutput) async {
    final response = await http.post(
      Uri.parse(_baseUrl),
      headers: {'Content-Type': 'application/json',
      'Accept': 'application/json'},
      body: jsonEncode({'llmResponse': llmOutput}),
    ).timeout(const Duration(seconds: 60));

    if (response.statusCode == 200) {
      final Map<String,dynamic> responseData= jsonDecode(response.body);
      List<dynamic> data = responseData['data']['claims'];
      return data.map((item) => claimResult.fromJs(item, item)).toList();
    } else {
      throw Exception('Failed to reach VeritasAI Backend');
    }
  }
}