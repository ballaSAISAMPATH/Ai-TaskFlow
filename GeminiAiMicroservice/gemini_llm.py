from typing import Optional, List
from langchain.llms.base import LLM
from langchain_core.pydantic_v1 import Field
import requests

class GeminiLLM(LLM):
    api_key: str = Field(...)
    model: str = Field(default="gemini-2.0-flash-exp")
    temperature: float = Field(default=0.8)
    max_tokens: int = Field(default=8000)

    @property
    def _llm_type(self) -> str:
        return "gemini"

    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager=None,
        **kwargs,
    ) -> str:
        import requests

        url = f'https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent'
        headers = {
            'Content-Type': 'application/json',
        }
        
        params = {
            'key': self.api_key
        }

        request_body = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": self.temperature,
                "maxOutputTokens": self.max_tokens,
                "topK": 40,
                "topP": 0.95,
                "candidateCount": 1,
                "stopSequences": []
            },
            "safetySettings": [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        }

        try:
            print(f"Making request to Gemini API...")
            response = requests.post(url, headers=headers, params=params, json=request_body, timeout=60)
            print(f"Response status code: {response.status_code}")
            
            response.raise_for_status()
            result = response.json()
            
            print(f"Raw API response keys: {list(result.keys())}")
            
            if 'candidates' in result and result['candidates']:
                candidate = result['candidates'][0]
                print(f"Candidate keys: {list(candidate.keys())}")
                
                if 'finishReason' in candidate:
                    print(f"Finish reason: {candidate['finishReason']}")
                    if candidate['finishReason'] == 'SAFETY':
                        return "Error: Content was blocked by safety filters"
                
                content = candidate.get('content', {})
                parts = content.get('parts', [])
                if parts and 'text' in parts[0]:
                    response_text = parts[0]['text'].strip()
                    print(f"Response text length: {len(response_text)}")
                    print(f"First 200 chars: {response_text[:200]}")
                    return response_text

            print(f"Unexpected response structure: {result}")
            return "Error: Could not extract response from Gemini API"

        except requests.exceptions.Timeout:
            return "Error: Request to Gemini API timed out"
        except requests.exceptions.RequestException as e:
            print(f"Request exception: {str(e)}")
            return f"Error calling Gemini API: {str(e)}"
        except Exception as e:
            print(f"General exception: {str(e)}")
            return f"Error processing response: {str(e)}"